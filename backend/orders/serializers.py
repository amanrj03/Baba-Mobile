from rest_framework import serializers
from .models import Order, OrderItem, Payment
from accounts.models import Address
from products.serializers import ProductSerializer

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone', 'address_line1', 'address_line2', 
                  'city', 'state', 'pincode', 'country']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = AddressSerializer(source='address', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    payment_method = serializers.SerializerMethodField()
    status_timeline = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'status']
    
    def get_payment_method(self, obj):
        return 'Razorpay' if obj.razorpay_order_id else 'Cash on Delivery'
    
    def get_status_timeline(self, obj):
        """Return timeline of status changes with timestamps"""
        timeline = []
        if obj.ordered_at:
            timeline.append({'status': 'ordered', 'timestamp': obj.ordered_at})
        if obj.shipped_at:
            timeline.append({'status': 'shipped', 'timestamp': obj.shipped_at})
        if obj.out_for_delivery_at:
            timeline.append({'status': 'out_for_delivery', 'timestamp': obj.out_for_delivery_at})
        if obj.delivered_at:
            timeline.append({'status': 'delivered', 'timestamp': obj.delivered_at})
        if obj.cancelled_at:
            timeline.append({'status': 'cancelled', 'timestamp': obj.cancelled_at})
        return timeline

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
