from django.urls import path
from .views import (BrandListView, ModelListView, ProductListView, 
                   ProductDetailView, ReviewListCreateView, WishlistView, 
                   WishlistDeleteView, CanReviewView)

urlpatterns = [
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('models/', ModelListView.as_view(), name='model-list'),
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='review-list'),
    path('<int:product_id>/can-review/', CanReviewView.as_view(), name='can-review'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/delete/', WishlistDeleteView.as_view(), name='wishlist-delete'),
]
