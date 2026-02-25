from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem, Coupon
from .serializers import CartSerializer, CartItemSerializer, CouponSerializer

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product') or request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item, created = CartItem.objects.get_or_create(
                cart=cart, product_id=product_id,
                defaults={'quantity': quantity}
            )
            if not created:
                item.quantity += quantity
                item.save()
            
            return Response({'message': 'Added to cart'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateCartItemView(generics.UpdateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class RemoveCartItemView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class ValidateCouponView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            return Response(CouponSerializer(coupon).data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon'}, status=status.HTTP_400_BAD_REQUEST)
