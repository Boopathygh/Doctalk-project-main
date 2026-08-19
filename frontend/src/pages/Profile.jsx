import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { User, Activity, Heart, Save } from 'lucide-react';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState(null);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            if (res.data.profile) {
                setProfile({ ...res.data.profile, username: res.data.username, email: res.data.email });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);
        try {
            await updateProfile(profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-primary p-6 flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{profile.username}</h1>
                                <p className="text-green-100">{profile.email}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="p-8">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-primary" /> Personal Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                                        <input
                                            type="text"
                                            value={profile.mobile_number}
                                            onChange={(e) => setProfile({ ...profile, mobile_number: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                                            <input
                                                type="number"
                                                value={profile.age}
                                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Weight (kg)</label>
                                            <input
                                                type="number"
                                                value={profile.weight}
                                                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-primary" /> Health Vitals
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                                        <select
                                            value={profile.blood_group}
                                            onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profile.has_diabetes}
                                                    onChange={(e) => setProfile({ ...profile, has_diabetes: e.target.checked })}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-gray-700">Diabetes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profile.has_blood_pressure}
                                                    onChange={(e) => setProfile({ ...profile, has_blood_pressure: e.target.checked })}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-gray-700">Blood Pressure</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profile.has_cancer}
                                                    onChange={(e) => setProfile({ ...profile, has_cancer: e.target.checked })}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-gray-700">Cancer History</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Other Medical History</label>
                            <textarea
                                value={profile.any_harmful_disease}
                                onChange={(e) => setProfile({ ...profile, any_harmful_disease: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:border-primary outline-none"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save size={20} /> {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
