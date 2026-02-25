from django.urls import path
from .views import (OrderListView, OrderDetailView, CreateOrderView, 
                   CancelOrderView, VerifyPaymentView, DownloadInvoiceView)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('<int:pk>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('<int:pk>/download-invoice/', DownloadInvoiceView.as_view(), name='download-invoice'),
]
