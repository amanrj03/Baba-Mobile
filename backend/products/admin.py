from django.contrib import admin
from .models import Brand, Model, Product, ProductImage, Review, Wishlist

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ['image', 'is_primary']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'model', 'price', 'stock', 'is_available']
    list_filter = ['model__brand', 'is_available']
    search_fields = ['name', 'model__name', 'model__brand__name']
    inlines = [ProductImageInline]

admin.site.register(Brand)
admin.site.register(Model)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review)
admin.site.register(Wishlist)
