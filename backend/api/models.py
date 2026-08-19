from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    mobile_number = models.CharField(max_length=15, blank=True)
    age = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(help_text="Weight in kg", null=True, blank=True)
    gender = models.CharField(max_length=10, choices=(('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')), blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    has_diabetes = models.BooleanField(default=False, verbose_name="Has Diabetes (Sugar)")
    has_blood_pressure = models.BooleanField(default=False, verbose_name="Has Blood Pressure")
    has_cancer = models.BooleanField(default=False, verbose_name="Has Cancer History")
    any_harmful_disease = models.TextField(blank=True, help_text="Any other harmful or chronic diseases")
    medical_history = models.TextField(blank=True, help_text="General medical history")

    def __str__(self):
        return f"Profile of {self.user.username}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100) # e.g., Cardiologist, General Physician
    qualification = models.CharField(max_length=100)
    experience_years = models.IntegerField(default=0)
    hospital_affiliation = models.CharField(max_length=200, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    is_verified = models.BooleanField(default=False)
    available_days = models.CharField(max_length=100, default="Mon-Fri") # Simple text for now

    def __str__(self):
        return f"Dr. {self.user.last_name} - {self.specialization}"

class Symptom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Disease(models.Model):
    SEVERITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    )
    name = models.CharField(max_length=200)
    symptoms = models.ManyToManyField(Symptom, related_name='diseases')
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='Low')
    consult_specialist = models.CharField(max_length=100, help_text="Recommended specialist eg. Cardiologist", blank=True)

    def __str__(self):
        return self.name

class Medicine(models.Model):
    TYPE_CHOICES = (
        ('Home', 'Home Remedy'),
        ('Ayurveda', 'Ayurveda'),
        ('Homeopathy', 'Homeopathy'),
        ('Allopathy', 'Allopathy'),
    )
    name = models.CharField(max_length=200)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='medicines')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField(blank=True)
    dosage = models.CharField(max_length=200, help_text="e.g. 500mg twice a day")
    side_effects = models.TextField(blank=True)
    is_prescription_required = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_as_patient')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments_as_doctor')
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    meet_link = models.URLField(blank=True, null=True)
    symptoms_summary = models.TextField(blank=True)

    def __str__(self):
        return f"Appointment: {self.patient} with {self.doctor} on {self.date_time}"

class MedicalReport(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    file = models.FileField(upload_to='reports/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analysis_result = models.TextField(blank=True, help_text="AI generated analysis")

    def __str__(self):
        return f"Report {self.id} for {self.patient.username}"

class HealthPlan(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_plans')
    created_at = models.DateTimeField(auto_now_add=True)
    diet_plan = models.TextField()
    exercise_plan = models.TextField()
    goals = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Health Plan for {self.patient.username}"
