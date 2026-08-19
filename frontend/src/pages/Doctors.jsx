import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Star, MapPin, Clock } from 'lucide-react';
import { api } from '../services/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Mock Data if API fails
    const mockDoctors = [
        { id: 1, user: { first_name: 'Sarah', last_name: 'Johnson' }, specialization: 'Cardiologist', experience_years: 12, hospital_affiliation: 'City Heart Center', consultation_fee: 1500, rating: 4.8 },
        { id: 2, user: { first_name: 'Rahul', last_name: 'Verma' }, specialization: 'General Physician', experience_years: 8, hospital_affiliation: 'DocTalk Clinic', consultation_fee: 500, rating: 4.5 },
        { id: 3, user: { first_name: 'Emily', last_name: 'Davis' }, specialization: 'Dermatologist', experience_years: 5, hospital_affiliation: 'Skin Care Plus', consultation_fee: 800, rating: 4.9 },
        { id: 4, user: { first_name: 'Michael', last_name: 'Chen' }, specialization: 'Pediatrician', experience_years: 15, hospital_affiliation: 'Childrens Hospital', consultation_fee: 1200, rating: 4.7 },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/doctors/');
                if (res.data.length > 0) {
                    setDoctors(res.data);
                } else {
                    setDoctors(mockDoctors);
                }
            } catch (err) {
                console.warn("Using mock doctors");
                setDoctors(mockDoctors);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleBook = (doctor) => {
        alert(`Booking appointment with Dr. ${doctor.user.last_name} coming soon! integration pending.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Expert Doctors</h1>
                    <p className="text-gray-600">Consult via Video, Audio, or Chat. Verified Specialists available 24/7.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor) => (
                            <motion.div
                                key={doctor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                                Dr
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.user.first_name} {doctor.user.last_name}</h3>
                                                <p className="text-primary font-medium">{doctor.specialization}</p>
                                                <p className="text-xs text-gray-500 mt-1">{doctor.experience_years} Years Experience</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold gap-1">
                                            <Star size={12} fill="currentColor" /> {doctor.rating || 4.5}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            {doctor.hospital_affiliation || 'DocTalk Virtual Clinic'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            Available Today: 10:00 AM - 6:00 PM
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500">Consultation Fee</p>
                                            <p className="font-bold text-gray-900">₹{doctor.consultation_fee}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-primary hover:bg-green-50 rounded-full transition-colors" title="Video Call"><Video size={20} /></button>
                                            <button
                                                onClick={() => handleBook(doctor)}
                                                className="btn-primary py-2 px-4 text-sm"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
