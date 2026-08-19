import { Link } from 'react-router-dom';
import { Activity, FileText, UserPlus, Stethoscope, ArrowRight } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-50 to-white pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:w-1/2">
                        <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-primary text-sm font-semibold mb-6">
                            AI-Powered Healthcare
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Your Personal <span className="text-primary">Health Assistant</span> Available 24/7
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            DocTalk combines advanced AI symptom analysis with real doctor consultations to provide accurate, timely, and personalized healthcare solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/symptoms" className="btn-primary text-center justify-center">
                                Check Symptoms Now <ArrowRight size={20} />
                            </Link>
                            <Link to="/doctors" className="px-6 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-green-50 transition-colors text-center">
                                Find a Doctor
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-green-100/50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Healthcare Ecosystem</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your health, from quick symptom checks to long-term chronic disease management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Activity size={32} />}
                            title="Symptom Checker"
                            desc="AI-driven analysis to understand your symptoms and suggest next steps."
                            color="bg-blue-50 text-blue-600"
                        />
                        <FeatureCard
                            icon={<FileText size={32} />}
                            title="Report Analyzer"
                            desc="Upload medical reports and get simple, easy-to-understand explanations."
                            color="bg-purple-50 text-purple-600"
                        />
                        <FeatureCard
                            icon={<Stethoscope size={32} />}
                            title="Expert Doctors"
                            desc="Connect with top specialists for video consultations and prescriptions."
                            color="bg-orange-50 text-orange-600"
                        />
                        <FeatureCard
                            icon={<UserPlus size={32} />}
                            title="Chronic Care"
                            desc="Personalized plans for diabetes, BP, and other long-term conditions."
                            color="bg-green-50 text-green-600"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="card hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default HomePage;
