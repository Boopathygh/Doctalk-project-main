from django.core.management.base import BaseCommand
from api.models import Disease, Symptom, Medicine

class Command(BaseCommand):
    help = 'Seeds the database with initial disease and medicine data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Symptoms
        symptoms_list = [
            'fever', 'cough', 'headache', 'fatigue', 'sore throat', 'runny nose',
            'body ache', 'shortness of breath', 'loss of taste', 'nausea', 'chest pain'
        ]
        symptom_objs = {}
        for s in symptoms_list:
            obj, _ = Symptom.objects.get_or_create(name=s)
            symptom_objs[s] = obj
            
        # Common Cold
        cold, _ = Disease.objects.get_or_create(
            name='Common Cold',
            defaults={
                'description': 'Viral infection of the upper respiratory tract.',
                'severity': 'Low',
                'consult_specialist': 'General Physician'
            }
        )
        cold.symptoms.add(symptom_objs['cough'], symptom_objs['runny nose'], symptom_objs['sore throat'], symptom_objs['headache'])
        
        # Flu
        flu, _ = Disease.objects.get_or_create(
            name='Influenza (Flu)',
            defaults={
                'description': 'Viral infection that attacks your respiratory system.',
                'severity': 'Medium',
                'consult_specialist': 'General Physician'
            }
        )
        flu.symptoms.add(symptom_objs['fever'], symptom_objs['body ache'], symptom_objs['fatigue'], symptom_objs['cough'])
        
        # Covid-19
        covid, _ = Disease.objects.get_or_create(
            name='COVID-19',
            defaults={
                'description': 'Infectious disease caused by the SARS-CoV-2 virus.',
                'severity': 'High',
                'consult_specialist': 'Pulmonologist'
            }
        )
        covid.symptoms.add(symptom_objs['fever'], symptom_objs['cough'], symptom_objs['loss of taste'], symptom_objs['shortness of breath'])
        
        # Medicines
        Medicine.objects.get_or_create(name='Paracetamol', disease=flu, type='Allopathy', dosage='500mg every 6 hours', defaults={'description': 'Pain reliever'})
        Medicine.objects.get_or_create(name='Ginger Tea', disease=cold, type='Home', dosage='Twice a day', defaults={'description': 'Soothes throat'})
        Medicine.objects.get_or_create(name='Vitamin C', disease=cold, type='Allopathy', dosage='1000mg daily', defaults={'description': 'Boosts immunity'})
        Medicine.objects.get_or_create(name='Steam Inhalation', disease=covid, type='Home', dosage='3 times a day', defaults={'description': 'Clears airways'})

        self.stdout.write(self.style.SUCCESS('Data seeded successfully'))
