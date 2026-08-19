import { useState } from 'react';
import { motion } from 'framer-motion';
import { checkSymptoms, getProfile } from '../services/api';
import { User, Activity, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const SymptomChecker = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [formData, setFormData] = useState({
        forWhom: 'myself',
        age: '',
        weight: '',
        gender: '',
        symptoms: '', // Text input for now, split by comma
        duration: '',
        history: ''
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleMyself = async () => {
        setLoading(true);
        try {
            const res = await getProfile();
            if (res.data.profile) {
                const p = res.data.profile;
                setFormData({
                    ...formData,
                    forWhom: 'myself',
                    age: p.age || '',
                    weight: p.weight || '',
                    gender: p.gender || '',
                });
            }
            handleNext();
        } catch (err) {
            console.error("Error fetching profile", err);
            // Proceed anyway even if fetch fails
            setFormData({ ...formData, forWhom: 'myself' });
            handleNext();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Convert comma separated string to array
            const symptomList = formData.symptoms.split(',').map(s => s.trim());
            const data = {
                symptoms: symptomList,
                age: formData.age,
                weight: formData.weight
            };

            // Call API (using mock response if backend fails for demo)
            try {
                const res = await checkSymptoms(data);
                setResults(res.results);
                setStep(4); // Results step
            } catch (err) {
                // Fallback for demo if backend isn't running
                console.warn("Backend failed, using mock data");
                setResults([
                    {
                        disease_name: "Viral Fever (Demo)",
                        match_score: 85,
                        severity: "Medium",
                        recommendation: "Home Remedies & Rest",
                        specialist: "General Physician",
                        allopathic_medicines: ["Paracetamol"],
                        home_remedies: ["Ginger Tea", "Warm Water"]
                    }
                ]);
                setStep(4);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                        <span className={step >= 1 ? 'text-primary' : ''}>Selection</span>
                        <span className={step >= 2 ? 'text-primary' : ''}>Details</span>
                        <span className={step >= 3 ? 'text-primary' : ''}>Analysis</span>
                        <span className={step >= 4 ? 'text-primary' : ''}>Results</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${(step / 4) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900 text-center">Who is this check for?</h2>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={handleMyself}
                                    className="p-8 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-green-50 transition-all group text-center"
                                >
                                    <User className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary mb-4" />
                                    <span className="text-lg font-medium text-gray-700 group-hover:text-primary">Myself</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            forWhom: 'others',
                                            age: '',
                                            weight: '',
                                            gender: ''
                                        });
                                        handleNext();
                                    }}
                                    className="p-8 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-green-50 transition-all group text-center"
                                >
                                    <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary mb-4" />
                                    <span className="text-lg font-medium text-gray-700 group-hover:text-primary">Someone Else</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about the patient</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="e.g. 25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="e.g. 70"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (separated by comma)</label>
                                <textarea
                                    value={formData.symptoms}
                                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    rows="3"
                                    placeholder="e.g. fever, headache, cough"
                                ></textarea>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={handleBack} className="flex items-center text-gray-500 hover:text-gray-700">
                                    <ArrowLeft size={20} className="mr-2" /> Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.symptoms || !formData.age}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Analyze Symptoms <ArrowRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                            <h3 className="text-xl font-medium text-gray-700">Dr. AI is analyzing your symptoms...</h3>
                        </div>
                    )}

                    {step === 4 && results && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-primary mb-4">
                                    <Activity size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Analysis Complete</h2>
                                <p className="text-gray-500">Based on the symptoms provided, here is our assessment.</p>
                            </div>

                            <div className="space-y-4">
                                {results.map((res, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{res.disease_name}</h3>
                                                <div className="flex gap-2 mt-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${res.severity === 'High' ? 'bg-red-100 text-red-700' :
                                                        res.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {res.severity} Severity
                                                    </span>
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                                        {res.match_score}% Match
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Suggested Specialist</p>
                                                <p className="font-medium text-primary">{res.specialist}</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Recommended Action</h4>
                                            <p className="text-gray-700">{res.recommendation}</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Recommended Medicines</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700">
                                                    {res.allopathic_medicines.map((m, i) => <li key={i}>{m}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Home Remedies</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700">
                                                    {res.home_remedies.map((m, i) => <li key={i}>{m}</li>)}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <button className="flex-1 btn-primary justify-center py-2">Consult a Doctor</button>
                                            <button className="flex-1 border border-primary text-primary rounded-full font-medium hover:bg-green-50 transition-colors">Buy Medicines</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                                <AlertCircle className="text-yellow-600 flex-shrink-0" />
                                <p className="text-sm text-yellow-700">
                                    <strong>Disclaimer:</strong> This is an AI-generated assessment and not a medical diagnosis. Please consult a certified doctor for professional advice.
                                </p>
                            </div>

                            <div className="text-center pt-4">
                                <button onClick={() => { setStep(1); setResults(null); }} className="text-gray-500 hover:text-primary">
                                    Start New Check
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserPlusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
)

export default SymptomChecker;
