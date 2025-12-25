import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Scissors, Layers, Palette, ClipboardCheck, Microscope, Gem } from 'lucide-react';

export default function CraftsmanshipPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-primary py-24 sm:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {/* Abstract textural pattern */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-black">
                        <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-accent/20 ring-1 ring-accent">
                            <Gem className="h-5 w-5 text-accent mr-2" />
                            <span className="text-sm font-medium tracking-wide text-accent uppercase">Excellence in Every Detail</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-6xl mb-6">
                            Our Craftsmanship
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-9e00 font-light leading-relaxed italic">
                            "Crafted with precision. Refined through experience."
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-16 bg-white">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-lg text-gray-700 leading-relaxed font-light">
                            At Ramba Exports, craftsmanship is the foundation of everything we create. Backed by decades of experience in textile manufacturing and exported, our approach reflects a deep understanding of fabrics, techniques, and finishing standards required for international markets.
                        </p>
                        <hr className="w-24 border-t-2 border-accent mx-auto mt-10" />
                    </div>
                </section>

                {/* Process Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                            {/* Fabric Selection */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                                <div className="h-12 w-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                                    <Layers className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Fabric Selection</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Each product begins with careful fabric selection, where raw materials are evaluated for texture, strength, and consistency. Only materials that meet our quality benchmarks move forward into production.
                                </p>
                            </div>

                            {/* Manufacturing Process */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                                <div className="h-12 w-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                                    <Scissors className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Manufacturing Excellence</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Our manufacturing process combines traditional textile expertise with modern production methods. From weaving and fabric processing to printing, embroidery, and final finishing, every stage is executed with close attention to detail by skilled craftsmen.
                                </p>
                            </div>

                            {/* Customization */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                                <div className="h-12 w-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                                    <Palette className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Integrative Customization</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Customization is an integral part of our craftsmanship. We support custom fabric printing, machine embroidery, hand embroidery, and tailored finishes, allowing buyers to develop collections that align with their brand identity.
                                </p>
                            </div>

                            {/* Quality Checks */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                                <div className="h-12 w-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                                    <ClipboardCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Rigorous Quality Control</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To maintain consistent quality, all products undergo multiple quality checks throughout production. Measurements, workmanship, color accuracy, and finishing are carefully inspected to ensure that each piece meets export standards.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Conclusion */}
                <section className="py-20 bg-primary text-black text-center">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Microscope className="h-12 w-12 text-accent mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold mb-6 ">Beyond Machinery</h2>
                        <p className="text-lg font-light text-gray-900 leading-relaxed mb-8">
                            Our craftsmanship is not defined by machinery alone, but by the people, processes, and discipline behind every product. This commitment enables us to deliver reliable quality, repeatable standards, and long-term value.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
