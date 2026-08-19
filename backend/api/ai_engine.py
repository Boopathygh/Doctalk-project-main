from .models import Disease

def calculate_disease_probability(user_symptoms, age, weight):
    """
    Mock AI Logic to predict disease based on symptoms.
    user_symptoms: list of strings (symptom names)
    return: list of dicts with disease, score, severity, recommendation
    """
    results = []
    diseases = Disease.objects.prefetch_related('symptoms').all()
    
    # Normalize user symptoms
    user_symptoms_set = set(s.lower() for s in user_symptoms)
    
    for disease in diseases:
        disease_symptoms = set(s.name.lower() for s in disease.symptoms.all())
        if not disease_symptoms:
            continue
            
        common_symptoms = user_symptoms_set.intersection(disease_symptoms)
        match_count = len(common_symptoms)
        
        if match_count > 0:
            # Simple score calculation
            # Weights: Critical diseases get a boost if critical symptoms match (mock logic)
            score = (match_count / len(disease_symptoms)) * 100
            
            # Severity handling
            severity_map = {'Low': 0, 'Medium': 10, 'High': 20, 'Critical': 30}
            base_severity_score = severity_map.get(disease.severity, 0)
            
            final_score = min(score + base_severity_score, 100)
            
            # Recommendation Logic
            rec_action = ""
            if final_score <= 30:
                rec_action = "Home Remedies"
            elif final_score <= 60:
                rec_action = "Ayurveda & Homeopathy"
            else:
                rec_action = "Allopathy + Doctor Consultation"
                
            results.append({
                'disease_name': disease.name,
                'match_score': round(final_score, 2),
                'severity': disease.severity,
                'recommendation': rec_action,
                'specialist': disease.consult_specialist,
                'allopathic_medicines': [m.name for m in disease.medicines.filter(type='Allopathy')], # Access related medicines
                'home_remedies': [m.name for m in disease.medicines.filter(type='Home')],
                'ayurvedic_medicines': [m.name for m in disease.medicines.filter(type='Ayurveda')],
            })
            
    # Sort by score desc
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results[:3] # Return top 3
