import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaWhatsapp, FaRocket, FaCheck, FaRandom } from 'react-icons/fa';

const LandingPage = () => {
    const pricingRef = useRef(null);

    const scrollToPricing = () => {
        pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-primary-50">
            <Header scrollToPricing={scrollToPricing} />
            <Hero scrollToPricing={scrollToPricing} />
            <HowItWorks />
            <NoSpam />
            <Pricing ref={pricingRef} />
            <Footer />
        </div>
    );
};

const Header = ({ scrollToPricing }) => (
    <header className="bg-primary-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold"
            >
                <Link to="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
                    Lead Chat App
                </Link>
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
            >
                <Link
                    to="/access"
                    className="text-white hover:text-primary-200 transition-colors"
                >
                    Already a member? Login here
                </Link>
                <button
                    onClick={scrollToPricing}
                    className="bg-white text-primary-600 px-6 py-2 rounded-full hover:bg-primary-100 transition-colors font-semibold"
                >
                    Get Started
                </button>
            </motion.div>
        </div>
    </header>
);

const Hero = ({ scrollToPricing }) => (
    <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0"
            >
                <img src="/macbook-mockup.png" alt="Lead Chat App" className="w-full" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:w-1/2 md:pl-8"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Unlock the Power of WhatsApp for Lead Generation
                </h2>
                <p className="text-xl mb-8">
                    Import group members, create custom message templates, and reach new leads effortlessly with Lead Chat App.
                </p>
                <button
                    onClick={scrollToPricing}
                    className="bg-white text-primary-600 px-8 py-3 rounded-full hover:bg-primary-100 transition-colors font-semibold text-lg"
                >
                    Get Started
                </button>
            </motion.div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="bg-white py-16">
        <div className="container mx-auto px-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-12 text-center text-primary-600"
            >
                How It Works
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Create Lead List", icon: FaClipboardList },
                    { title: "Import WhatsApp Group Members", icon: FaWhatsapp },
                    { title: "Reach Out", icon: FaRocket },
                ].map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center"
                    >
                        <step.icon className="text-5xl mb-4 text-primary-500 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2 text-primary-600">{step.title}</h3>
                        <p className="text-primary-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const NoSpam = () => (
    <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-12 text-center"
            >
                No Spam
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row items-center justify-center"
            >
                <FaRandom className="text-6xl mb-6 md:mb-0 md:mr-8" />
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-semibold mb-4">Random Delay Feature</h3>
                    <p className="text-lg max-w-2xl">
                        We use a smart random delay (30s - 60s) before sending each message. This helps to avoid spam detection,
                        ensuring your outreach remains effective and uninterrupted.
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

const Pricing = React.forwardRef((props, ref) => (
    <section ref={ref} className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-12 text-center text-primary-600"
            >
                Pricing
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <PricingCard
                    title="Limited Offer"
                    originalPrice="$20"
                    discountedPrice="$10"
                    features={[
                        "One list",
                        "One message template",
                        "Limited to 100 people per list",
                        "Perfect for trying out the app"
                    ]}
                    delay={0.2}
                />
                <PricingCard
                    title="Lifetime Offer"
                    originalPrice="$200"
                    discountedPrice="$100"
                    features={[
                        "Unlimited lists",
                        "Unlimited message templates",
                        "No list size limits",
                        "Lifetime updates"
                    ]}
                    highlighted={true}
                    delay={0.4}
                />
            </div>
        </div>
    </section>
));

const PricingCard = ({ title, originalPrice, discountedPrice, features, highlighted = false, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`bg-white rounded-lg p-8 flex flex-col relative ${highlighted ? 'shadow-2xl ring-4 ring-primary-300' : 'shadow-xl'}`}
    >
        <div className="absolute -top-4 -right-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            50% Launch Discount
        </div>
        <h3 className={`text-2xl font-bold mb-4 ${highlighted ? 'text-primary-600' : 'text-primary-700'}`}>{title}</h3>
        <div className="mb-6">
            <span className="text-2xl font-bold line-through text-primary-400 mr-2">{originalPrice}</span>
            <span className="text-4xl font-bold text-primary-600">{discountedPrice}</span>
        </div>
        <ul className="text-primary-600 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="mb-2 flex items-center">
                    <FaCheck className="w-5 h-5 mr-2 text-primary-500" />
                    {feature}
                </li>
            ))}
        </ul>
        <button className={`mt-auto py-2 px-4 rounded-full font-semibold ${highlighted ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-100 text-primary-800 hover:bg-primary-200'} transition-colors`}>
            Get Started
        </button>
    </motion.div>
);

const Footer = () => (
    <footer className="bg-primary-600 text-white py-8">
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Lead Chat App</h3>
                    <p>Revolutionizing WhatsApp lead generation</p>
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                    <ul>
                        <li><a href="#" className="hover:text-primary-200">Home</a></li>
                        <li><a href="#" className="hover:text-primary-200">Features</a></li>
                        <li><a href="#" className="hover:text-primary-200">Pricing</a></li>
                        <li><a href="#" className="hover:text-primary-200">Contact</a></li>
                    </ul>
                </div>
                <div className="w-full md:w-1/3">
                    <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-primary-200"><FaWhatsapp /></a>
                        <a href="#" className="hover:text-primary-200"><FaRocket /></a>
                        {/* Add more social icons as needed */}
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <p>&copy; 2023 Lead Chat App. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


export default LandingPage;