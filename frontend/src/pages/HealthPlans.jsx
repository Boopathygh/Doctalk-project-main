import { Utensils, Activity, Heart } from 'lucide-react';

const HealthPlans = () => {
    return (
        <div className="min-h-screen bg-green-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Personalized Health & Diet Plans</h1>
                    <p className="text-gray-600">Tailored plans to help you achieve your wellness goals, managed by AI.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <PlanCard
                        title="Weight Loss Plan"
                        icon={<Activity />}
                        desc="Calorie-deficit diet combined with cardio workouts."
                        features={['Sample Diet Chart', 'Daily Cardio Routine', 'Progress Tracking']}
                        color="bg-orange-50 text-orange-600"
                    />
                    <PlanCard
                        title="Heart Healthy"
                        icon={<Heart />}
                        desc="Low sodium, low cholesterol diet for cardiovascular health."
                        features={['BP Monitoring Log', 'Low-Sodium Recipes', 'Stress Management']}
                        color="bg-red-50 text-red-600"
                    />
                    <PlanCard
                        title="Balanced Living"
                        icon={<Utensils />}
                        desc="Maintain a healthy lifestyle with balanced nutrition."
                        features={['Weekly Meal Prep', 'Yoga Routine', 'Hydration Alerts']}
                        color="bg-green-50 text-green-600"
                    />
                </div>
            </div>
        </div>
    );
};

const PlanCard = ({ title, icon, desc, features, color }) => (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{desc}</p>
        <ul className="space-y-3 mb-8">
            {features.map((f, i) => (
                <li key={i} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    {f}
                </li>
            ))}
        </ul>
        <button className="w-full btn-primary justify-center">Select Plan</button>
    </div>
);

export default HealthPlans;
