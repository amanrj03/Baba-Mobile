from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Brand, Model, Product, Review, Wishlist
from .serializers import (BrandSerializer, ModelSerializer, ProductSerializer, 
                         ReviewSerializer, WishlistSerializer)

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]

class ModelListView(generics.ListAPIView):
    serializer_class = ModelSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Model.objects.all()
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        return queryset

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['price', 'created_at', 'sales']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Handle brand filter (model__brand)
        brand_ids = self.request.query_params.get('model__brand')
        if brand_ids:
            brand_list = [int(x.strip()) for x in brand_ids.split(',') if x.strip().isdigit()]
            if brand_list:
                queryset = queryset.filter(model__brand__id__in=brand_list)
        
        # Handle model filter
        model_ids = self.request.query_params.get('model')
        if model_ids:
            model_list = [int(x.strip()) for x in model_ids.split(',') if x.strip().isdigit()]
            if model_list:
                queryset = queryset.filter(model__id__in=model_list)
        
        # Handle RAM filter
        ram_values = self.request.query_params.get('ram')
        if ram_values:
            ram_list = [x.strip() for x in ram_values.split(',') if x.strip()]
            if ram_list:
                queryset = queryset.filter(ram__in=ram_list)
        
        # Handle storage filter
        storage_values = self.request.query_params.get('storage')
        if storage_values:
            storage_list = [x.strip() for x in storage_values.split(',') if x.strip()]
            if storage_list:
                queryset = queryset.filter(storage__in=storage_list)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class CanReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, product_id):
        from orders.models import OrderItem
        
        has_purchased = OrderItem.objects.filter(
            order__user=request.user,
            product_id=product_id,
            order__status__in=['ordered', 'shipped', 'out_for_delivery', 'delivered']
        ).exists()
        
        has_reviewed = Review.objects.filter(
            user=request.user,
            product_id=product_id
        ).exists()
        
        return Response({
            'can_review': has_purchased and not has_reviewed,
            'has_purchased': has_purchased,
            'has_reviewed': has_reviewed
        })

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(product_id=product_id)
    
    def perform_create(self, serializer):
        from orders.models import OrderItem
        
        product_id = self.kwargs.get('product_id')
        user = self.request.user
        
        # Check if user has purchased this product
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product_id=product_id,
            order__status__in=['ordered', 'shipped', 'out_for_delivery', 'delivered']
        ).exists()
        
        if not has_purchased:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only review products you have purchased.')
        
        serializer.save(user=user, product_id=product_id)

class WishlistView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product') or request.data.get('product_id')
        
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Check if already in wishlist
            wishlist_item, created = Wishlist.objects.get_or_create(
                user=request.user,
                product_id=product_id
            )
            
            if created:
                serializer = self.get_serializer(wishlist_item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Already in wishlist'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WishlistDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def delete(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, product_id=product_id)
            wishlist_item.delete()
            return Response({'message': 'Removed from wishlist'}, status=status.HTTP_200_OK)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Item not in wishlist'}, status=status.HTTP_404_NOT_FOUND)
