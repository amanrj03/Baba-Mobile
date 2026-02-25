from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
from accounts.models import Address

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ('ordered', 'Ordered'),
        ('shipped', 'Shipped'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ordered')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=20, default='pending')
    
    # Timestamps for each status
    created_at = models.DateTimeField(auto_now_add=True)
    ordered_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    out_for_delivery_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Auto-set timestamp when status changes
        from django.utils import timezone
        
        # For new orders, set ordered_at
        if not self.pk:
            if not self.ordered_at:
                self.ordered_at = timezone.now()
        else:
            # For existing orders, check if status changed
            try:
                old_order = Order.objects.get(pk=self.pk)
                if old_order.status != self.status:
                    current_time = timezone.now()
                    
                    # Define status order
                    status_order = ['ordered', 'shipped', 'out_for_delivery', 'delivered']
                    
                    if self.status == 'cancelled':
                        if not self.cancelled_at:
                            self.cancelled_at = current_time
                    else:
                        # Get the index of new status
                        try:
                            new_status_index = status_order.index(self.status)
                            
                            # Fill in all intermediate timestamps if they don't exist
                            for i in range(new_status_index + 1):
                                status = status_order[i]
                                timestamp_field = f"{status}_at"
                                
                                if not getattr(self, timestamp_field):
                                    setattr(self, timestamp_field, current_time)
                        except ValueError:
                            # Status not in order list, handle individually
                            if self.status == 'ordered' and not self.ordered_at:
                                self.ordered_at = current_time
                            elif self.status == 'shipped' and not self.shipped_at:
                                self.shipped_at = current_time
                            elif self.status == 'out_for_delivery' and not self.out_for_delivery_at:
                                self.out_for_delivery_at = current_time
                            elif self.status == 'delivered' and not self.delivered_at:
                                self.delivered_at = current_time
            except Order.DoesNotExist:
                pass
        
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def subtotal(self):
        return self.price * self.quantity

class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
