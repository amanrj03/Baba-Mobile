from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Address, User
from .serializers import UserSerializer, RegisterSerializer, AddressSerializer
import random
import string

class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        # Store OTP temporarily (you might want to use cache or session)
        # For now, we'll create a temporary user or use session
        request.session['signup_otp'] = otp
        request.session['signup_email'] = email
        request.session['otp_created_at'] = timezone.now().isoformat()
        
        # Send OTP via email
        try:
            send_mail(
                'Your Verification Code - Baba Mobiles',
                f'Your verification code is: {otp}\n\nThis code will expire in 10 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        otp = request.data.get('otp')
        email = request.session.get('signup_email')
        stored_otp = request.session.get('signup_otp')
        otp_created_at = request.session.get('otp_created_at')
        
        if not otp or not stored_otp:
            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP is expired (10 minutes)
        if otp_created_at:
            from datetime import datetime, timedelta
            created_time = datetime.fromisoformat(otp_created_at)
            if timezone.now() > created_time + timedelta(minutes=10):
                return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp == stored_otp:
            request.session['email_verified'] = True
            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.session.get('signup_email')
        
        if not email:
            return Response({'error': 'No email found in session'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate new OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        request.session['signup_otp'] = otp
        request.session['otp_created_at'] = timezone.now().isoformat()
        
        # Send OTP via email
        try:
            send_mail(
                'Your Verification Code - Baba Mobiles',
                f'Your verification code is: {otp}\n\nThis code will expire in 10 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'OTP resent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to resend OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        # Check if email is verified
        if not request.session.get('email_verified'):
            return Response({'error': 'Email not verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Clear session data after successful registration
        response = super().create(request, *args, **kwargs)
        request.session.pop('signup_otp', None)
        request.session.pop('signup_email', None)
        request.session.pop('otp_created_at', None)
        request.session.pop('email_verified', None)
        
        return response

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        
        return Response({'message': 'Password changed successfully'})

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
