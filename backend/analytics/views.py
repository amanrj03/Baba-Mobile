from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from orders.models import Order
from products.models import Product

class DashboardView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        total_revenue = Order.objects.filter(status='delivered').aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        top_selling = Product.objects.order_by('-sales')[:5]
        most_viewed = Product.objects.order_by('-views')[:5]
        low_stock = Product.objects.filter(stock__lt=10)
        
        data = {
            'total_revenue': total_revenue,
            'total_orders': Order.objects.count(),
            'top_selling': [{'name': p.name, 'sales': p.sales} for p in top_selling],
            'most_viewed': [{'name': p.name, 'views': p.views} for p in most_viewed],
            'low_stock': [{'name': p.name, 'stock': p.stock} for p in low_stock],
        }
        
        return Response(data)
