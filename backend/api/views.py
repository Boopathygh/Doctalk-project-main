from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, PatientProfileSerializer, DoctorProfileSerializer
from .models import PatientProfile, DoctorProfile

User = get_user_model()

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Create profile based on role
        if user.role == 'patient':
            # Extract profile data from request.data
            profile_data = {
                'mobile_number': self.request.data.get('mobile_number', ''),
                'age': self.request.data.get('age'),
                'weight': self.request.data.get('weight'),
                'gender': self.request.data.get('gender', ''),
                'blood_group': self.request.data.get('blood_group', ''),
                'has_diabetes': self.request.data.get('has_diabetes'),
                'has_blood_pressure': self.request.data.get('has_blood_pressure'),
                'has_cancer': self.request.data.get('has_cancer'),
                'any_harmful_disease': self.request.data.get('any_harmful_disease', ''),
                'medical_history': self.request.data.get('medical_history', ''),
            }
            # Remove None values
            profile_data = {k: v for k, v in profile_data.items() if v is not None}
            
            PatientProfile.objects.create(user=user, **profile_data)
        elif user.role == 'doctor':
             # Extract basic doctor info if provided (not prioritized in this task)
            DoctorProfile.objects.create(user=user)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.role == 'patient':
            try:
                profile = user.patient_profile
                data['profile'] = PatientProfileSerializer(profile).data
            except PatientProfile.DoesNotExist:
                data['profile'] = None
        elif user.role == 'doctor':
            try:
                profile = user.doctor_profile
                data['profile'] = DoctorProfileSerializer(profile).data
            except DoctorProfile.DoesNotExist:
                data['profile'] = None
        return Response(data)

    def patch(self, request):
        user = request.user
        data = request.data
        
        # Update User fields if present
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        user.save()

        # Update Profile fields
        if user.role == 'patient':
            profile = user.patient_profile
            serializer = PatientProfileSerializer(profile, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(UserSerializer(user).data) # Return updated user struct
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"status": "success"})
from .ai_engine import calculate_disease_probability

class SymptomCheckView(APIView):
    # Allow any for now to test easily, or IsAuthenticated
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        symptoms = request.data.get('symptoms', [])
        age = request.data.get('age')
        weight = request.data.get('weight')
        
        if not symptoms:
            return Response({"error": "No symptoms provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        results = calculate_disease_probability(symptoms, age, weight)
        return Response({"results": results})
class ReportUploadView(APIView):
    permission_classes = [permissions.AllowAny] # Change to IsAuthenticated later
    
    def post(self, request):
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
        file = request.FILES['file']
        # Mock Analysis Logic
        # In real app: OCR -> LLM
        
        analysis = """
        Analysis of Uploaded Report:
        1. Blood Hemoglobin levels are slightly low (11.2 g/dL). Normal range is 13-17 g/dL.
        2. White Blood Cell count is normal.
        3. Platelet count is within healthy range.
        
        Recommendations:
        - Increase iron-rich food intake (Spinach, Red Meat, Legumes).
        - Stay hydrated.
        - Consult a General Physician if fatigue persists.
        """
        
        return Response({
            "success": True, 
            "filename": file.name,
            "analysis": analysis
        })

class DoctorListView(generics.ListAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]

class AppointmentView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        return Response({
            "success": True,
            "message": "Appointment booked successfully",
            "appointment_id": 12345
        })

from .chatbot_logic import DocTalkChatbot

class ChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message')
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        bot = DocTalkChatbot()
        response = bot.get_response(message)
        
        return Response({"response": response})
