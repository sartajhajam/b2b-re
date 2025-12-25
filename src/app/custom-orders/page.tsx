import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function CustomOrdersPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-primary py-24 sm:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {/* Abstract pattern or texture could go here */}
                        <svg className="h-full w-full text-accent" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" />
                        </svg>
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-black sm:text-6xl mb-6">
                            Custom Orders & Private Label
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-black font-light leading-relaxed">
                            Bespoke solutions for your brand. From concept to creation, we bring your vision to life with exquisite craftsmanship.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 sm:py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                                        Tailored to Your Specifications
                                    </h2>
                                    <div className="w-20 h-1 bg-accent mb-6"></div>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        We specialize in supporting buyers with custom fabric development and product customization. Our capabilities include custom fabric printing, machine and hand embroidery, color matching, and other relevant value-added solutions tailored to your market requirements.
                                    </p>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Whether you are developing a new collection, private label range, or bespoke order, our team will work closely with you to deliver the right product with consistent quality and timely execution.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <p className="text-xl font-serif font-medium text-primary italic">
                                        "Contact Us to discuss your requirements, and let us assist you with a complete, end-to-end solution."
                                    </p>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent transform translate-x-4 translate-y-4 rounded-2xl hidden sm:block"></div>
                                <div className="relative bg-primary text-black p-8 sm:p-12 rounded-2xl shadow-xl">
                                    <h3 className="text-2xl font-serif font-bold mb-8 flex items-center">
                                        Contact Information
                                        <ArrowRight className="ml-3 h-5 w-5 text-accent" />
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg">
                                                <MapPin className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="ml-6">
                                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Address</p>
                                                <p className="text-lg font-light">Export House,<br />FA-40 B Shaheen Bagh<br />Delhi-110025</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg">
                                                <Phone className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="ml-6">
                                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Phone</p>
                                                <div className="flex items-center">
                                                    <p className="text-lg font-light">+91 9667478513</p>
                                                    <a
                                                        href="https://wa.me/919667478513"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-green-600 hover:text-green-700 transition-colors"
                                                        title="Chat on WhatsApp"
                                                    >
                                                        <WhatsAppIcon className="h-6 w-6" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg">
                                                <Mail className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="ml-6">
                                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                                                <a href="mailto:trade@rambaexports.com" className="block text-lg font-light hover:text-accent transition-colors">trade@rambaexports.com</a>
                                                <a href="mailto:exportsramba@gmail.com" className="block text-lg font-light hover:text-accent transition-colors">exportsramba@gmail.com</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
