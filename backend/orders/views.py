from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show orders with completed payment
        return Order.objects.filter(
            user=self.request.user,
            payment_status='completed'
        ).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            from accounts.models import Address
            
            cart = Cart.objects.get(user=request.user)
            
            if not cart.items.exists():
                return Response(
                    {'error': 'Cart is empty'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Handle address - either use existing or create new
            address_id = request.data.get('address_id')
            shipping_address = request.data.get('shipping_address')
            
            if address_id:
                # Use existing address
                address = Address.objects.get(id=address_id, user=request.user)
            elif shipping_address:
                # Create new address from provided data
                address = Address.objects.create(
                    user=request.user,
                    full_name=shipping_address.get('full_name'),
                    phone=shipping_address.get('phone'),
                    address_line1=shipping_address.get('address_line1'),
                    address_line2=shipping_address.get('address_line2', ''),
                    city=shipping_address.get('city'),
                    state=shipping_address.get('state'),
                    pincode=shipping_address.get('postal_code') or shipping_address.get('pincode'),
                    country=shipping_address.get('country', 'United States'),
                    is_default=False
                )
            else:
                return Response(
                    {'error': 'Address is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create Razorpay order WITHOUT saving to database yet
            import razorpay
            from django.conf import settings
            
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            
            # Create Razorpay order (amount in paise)
            razorpay_order = client.order.create({
                'amount': int(cart.total * 100),  # Convert to paise
                'currency': 'INR',
                'payment_capture': 1
            })
            
            # Store order details in session temporarily (don't save to DB yet)
            request.session['pending_order'] = {
                'address_id': address.id,
                'total_amount': str(cart.total),
                'razorpay_order_id': razorpay_order['id'],
                'cart_items': [
                    {
                        'product_id': item.product.id,
                        'quantity': item.quantity,
                        'price': str(item.product.final_price)
                    }
                    for item in cart.items.all()
                ]
            }
            
            # Return Razorpay order details
            return Response({
                'razorpay_order_id': razorpay_order['id'],
                'amount': razorpay_order['amount'],
                'total_amount': cart.total
            }, status=status.HTTP_201_CREATED)
            
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            
            # Only allow cancellation of ordered/shipped orders
            if order.status in ['ordered', 'shipped']:
                # Restore stock since payment was completed
                if order.payment_status == 'completed':
                    for item in order.items.all():
                        if item.product:
                            item.product.stock += item.quantity
                            item.product.sales -= item.quantity
                            item.product.save()
                
                order.status = 'cancelled'
                order.save()
                return Response({'message': 'Order cancelled successfully'})
            
            return Response(
                {'error': 'Cannot cancel order in current status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            import razorpay
            from django.conf import settings
            from accounts.models import Address
            
            order_id = request.data.get('order_id')
            payment_id = request.data.get('payment_id')
            signature = request.data.get('signature')
            
            if not all([order_id, payment_id, signature]):
                return Response(
                    {'error': 'Missing payment details'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get pending order from session
            pending_order = request.session.get('pending_order')
            if not pending_order or pending_order.get('razorpay_order_id') != order_id:
                return Response(
                    {'error': 'Order session expired or invalid'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify payment signature
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            
            try:
                client.utility.verify_payment_signature({
                    'razorpay_order_id': order_id,
                    'razorpay_payment_id': payment_id,
                    'razorpay_signature': signature
                })
                
                # Payment verified - NOW create the order in database
                address = Address.objects.get(id=pending_order['address_id'])
                
                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    total_amount=pending_order['total_amount'],
                    razorpay_order_id=order_id,
                    razorpay_payment_id=payment_id,
                    payment_status='completed',
                    status='ordered'
                )
                
                # Create order items and update stock
                from products.models import Product
                for item_data in pending_order['cart_items']:
                    product = Product.objects.get(id=item_data['product_id'])
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=item_data['quantity'],
                        price=item_data['price']
                    )
                    
                    # Update product stock and sales
                    if product.stock >= item_data['quantity']:
                        product.stock -= item_data['quantity']
                    product.sales += item_data['quantity']
                    product.save()
                
                # Clear cart after successful payment
                cart = Cart.objects.get(user=request.user)
                cart.items.all().delete()
                
                # Clear session
                del request.session['pending_order']
                
                return Response({
                    'message': 'Payment verified successfully',
                    'order_id': order.id
                }, status=status.HTTP_200_OK)
                
            except razorpay.errors.SignatureVerificationError:
                # Payment verification failed - don't create order
                return Response(
                    {'error': 'Invalid payment signature'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DownloadInvoiceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            from django.http import HttpResponse
            from reportlab.lib.pagesizes import A4
            from reportlab.lib import colors
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.enums import TA_CENTER, TA_LEFT
            from io import BytesIO
            
            logger.info(f"Generating invoice for order {pk}")
            
            # Get order
            try:
                order = Order.objects.get(pk=pk, user=request.user)
                logger.info(f"Order found: {order.id}, Status: {order.status}")
            except Order.DoesNotExist:
                logger.error(f"Order {pk} not found for user {request.user}")
                return Response(
                    {'error': 'Order not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Create PDF
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)
            
            # Container for elements
            elements = []
            
            # Styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#9b51e0'),
                spaceAfter=30,
                alignment=TA_CENTER
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#333333'),
                spaceAfter=12,
            )
            
            # Title
            elements.append(Paragraph("INVOICE", title_style))
            elements.append(Spacer(1, 12))
            
            # Company Info
            company_info = [
                ["Baba Mobiles", f"Invoice #: {order.id}"],
                ["Phone: +91 8529871980", f"Date: {order.created_at.strftime('%B %d, %Y')}"],
                ["Email: info@babamobiles.com", f"Status: {order.status.upper()}"],
            ]
            
            company_table = Table(company_info, colWidths=[3*inch, 3*inch])
            company_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#333333')),
                ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#666666')),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ]))
            elements.append(company_table)
            elements.append(Spacer(1, 20))
            
            # Billing Address
            elements.append(Paragraph("Bill To:", heading_style))
            if order.address:
                try:
                    address_parts = [
                        order.address.full_name,
                        order.address.address_line1,
                    ]
                    if order.address.address_line2:
                        address_parts.append(order.address.address_line2)
                    
                    city_state_zip = f"{order.address.city}, {order.address.state}"
                    if hasattr(order.address, 'pincode') and order.address.pincode:
                        city_state_zip += f" {order.address.pincode}"
                    address_parts.append(city_state_zip)
                    address_parts.append(order.address.country)
                    address_parts.append(f"Phone: {order.address.phone}")
                    
                    address_text = "<br/>".join(address_parts)
                    elements.append(Paragraph(address_text, styles['Normal']))
                except Exception as addr_error:
                    logger.error(f"Error formatting address: {str(addr_error)}")
                    elements.append(Paragraph("Address information unavailable", styles['Normal']))
            else:
                elements.append(Paragraph("No address provided", styles['Normal']))
            elements.append(Spacer(1, 20))
            
            # Order Items Table
            elements.append(Paragraph("Order Items:", heading_style))
            
            # Table data
            data = [['Product', 'Quantity', 'Unit Price', 'Total']]
            
            order_items = order.items.all()
            
            if not order_items.exists():
                data.append(['No items in this order', '', '', 'Rs. 0.00'])
            else:
                for item in order_items:
                    try:
                        product_name = item.product.name if item.product else 'Product (Deleted)'
                        data.append([
                            product_name,
                            str(item.quantity),
                            f"Rs. {float(item.price):.2f}",
                            f"Rs. {float(item.subtotal):.2f}"
                        ])
                    except Exception as item_error:
                        logger.error(f"Error processing item {item.id}: {str(item_error)}")
                        data.append(['Error loading product', str(item.quantity), 'Rs. 0.00', 'Rs. 0.00'])
            
            # Add totals
            data.append(['', '', 'Subtotal:', f"Rs. {float(order.total_amount):.2f}"])
            data.append(['', '', 'Shipping:', 'Rs. 0.00'])
            data.append(['', '', 'Total:', f"Rs. {float(order.total_amount):.2f}"])
            
            # Create table
            items_table = Table(data, colWidths=[3*inch, 1*inch, 1.2*inch, 1.2*inch])
            items_table.setStyle(TableStyle([
                # Header
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#9b51e0')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                
                # Body
                ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -4), 10),
                ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
                ('ALIGN', (0, 1), (0, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -4), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -4), [colors.white, colors.HexColor('#f9f9f9')]),
                
                # Totals
                ('FONTNAME', (2, -3), (-1, -1), 'Helvetica-Bold'),
                ('LINEABOVE', (2, -3), (-1, -3), 1, colors.grey),
                ('LINEABOVE', (2, -1), (-1, -1), 2, colors.black),
            ]))
            elements.append(items_table)
            elements.append(Spacer(1, 30))
            
            # Payment Info
            elements.append(Paragraph("Payment Information:", heading_style))
            payment_text = f"""
            Payment Method: Razorpay<br/>
            Payment Status: {order.payment_status.upper()}<br/>
            {f'Transaction ID: {order.razorpay_payment_id}<br/>' if order.razorpay_payment_id else ''}
            """
            elements.append(Paragraph(payment_text, styles['Normal']))
            elements.append(Spacer(1, 30))
            
            # Footer
            footer_style = ParagraphStyle(
                'Footer',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.grey,
                alignment=TA_CENTER
            )
            elements.append(Paragraph("Thank you for your business!", footer_style))
            elements.append(Paragraph("For any queries, contact us at support@babamobiles.com", footer_style))
            
            # Build PDF
            doc.build(elements)
            
            # Get PDF value
            pdf = buffer.getvalue()
            buffer.close()
            
            # Create response
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="invoice_{order.id}.pdf"'
            response.write(pdf)
            
            return response
            
        except Order.DoesNotExist:
            logger.error(f"Order {pk} not found for user {request.user}")
            return Response(
                {'error': 'Order not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error generating invoice: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Error generating invoice: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
