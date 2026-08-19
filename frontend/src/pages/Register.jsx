import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { User, Mail, Phone, Lock, Heart, Activity, AlertTriangle, ArrowRight } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '', // Frontend only validation
        mobile_number: '',
        age: '',
        weight: '',
        gender: '',
        blood_group: '',
        has_diabetes: false,
        has_blood_pressure: false,
        has_cancer: false,
        any_harmful_disease: '',
        medical_history: ''
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response?.data?.username) {
                setError("Username already exists");
            } else {
                setError("Registration failed. Please check your details.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary p-6 text-center">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-green-100 mt-2">Join DocTalk for personalized healthcare</p>
                </div>

                <div className="p-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <div className={`w-16 h-1 bg-gray-200 ${step >= 2 ? 'bg-primary' : ''}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <div className="relative">
                                            <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                                                placeholder="johndoe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.mobile_number}
                                            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                                            className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                required
                                                value={formData.confirm_password}
                                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!formData.username || !formData.email || !formData.password}
                                    className="w-full btn-primary justify-center py-3 flex items-center gap-2"
                                >
                                    Next Step <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Activity className="text-primary" /> Health Profile
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary outline-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <select
                                        value={formData.blood_group}
                                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary outline-none"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <p className="font-medium text-gray-700 text-sm">Chronic Conditions:</p>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.has_diabetes}
                                                onChange={(e) => setFormData({ ...formData, has_diabetes: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                                            />
                                            <span className="text-gray-600 text-sm">Diabetes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.has_blood_pressure}
                                                onChange={(e) => setFormData({ ...formData, has_blood_pressure: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                                            />
                                            <span className="text-gray-600 text-sm">Blood Pressure</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.has_cancer}
                                                onChange={(e) => setFormData({ ...formData, has_cancer: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                                            />
                                            <span className="text-gray-600 text-sm">Cancer History</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Harmful/Chronic Diseases</label>
                                    <textarea
                                        value={formData.any_harmful_disease}
                                        onChange={(e) => setFormData({ ...formData, any_harmful_disease: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary outline-none"
                                        rows="2"
                                        placeholder="Specific allergies, surgeries, etc."
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] btn-primary justify-center py-3"
                                    >
                                        {loading ? 'Creating Account...' : 'Finish Registration'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="mt-6 text-center text-sm border-t border-gray-100 pt-4">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary hover:text-dark">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
