from django.urls import path
from .views import (CartView, AddToCartView, UpdateCartItemView, 
                   RemoveCartItemView, ValidateCouponView)

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('items/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('items/<int:pk>/remove/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('validate-coupon/', ValidateCouponView.as_view(), name='validate-coupon'),
]
