from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brands/', blank=True)
    
    def __str__(self):
        return self.name

class Model(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    
    class Meta:
        unique_together = ['brand', 'name']
    
    def __str__(self):
        return f"{self.brand.name} {self.name}"

class Product(models.Model):
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    specifications = models.TextField(blank=True, help_text='Enter specifications in bullet points, one per line')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.IntegerField(default=0)
    ram = models.CharField(max_length=20)
    storage = models.CharField(max_length=20)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    sales = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def final_price(self):
        from decimal import Decimal
        return self.price * (Decimal('1') - Decimal(str(self.discount_percent)) / Decimal('100'))
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum(r.rating for r in reviews) / len(reviews)
        return 0
    
    @property
    def review_count(self):
        return self.reviews.count()

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.product.name} - Image"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['product', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'product']
