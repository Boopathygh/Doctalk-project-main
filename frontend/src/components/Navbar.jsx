import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Symptom Checker', path: '/symptoms' },
        { name: 'Report Analyzer', path: '/analyzer' },
        { name: 'Doctors', path: '/doctors' },
        { name: 'Health Plans', path: '/health-plans' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">+</span>
                            </div>
                            <span className="font-bold text-2xl text-primary tracking-tight">DocTalk</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-gray-600 hover:text-primary transition-colors font-medium text-sm"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>


                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <>
                            {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50 rounded-md"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                        </>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
