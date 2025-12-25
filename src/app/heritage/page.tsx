import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, Globe, ShieldCheck, History } from 'lucide-react';

export default function HeritagePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-primary py-24 sm:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        {/* Pattern overlay for depth */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#C9A24D 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-black">
                        <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-6xl mb-6">
                            Our Heritage
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-900 font-light leading-relaxed italic">
                            "A legacy built on experience, integrity, and enduring partnerships."
                        </p>
                    </div>
                </section>

                {/* Narrative Section */}
                <section className="py-20 bg-white">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-20">
                        {/* Founding */}
                        <div className="relative pl-8 border-l-2 border-accent/30">
                            <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent"></span>
                            <div className="mb-2 flex items-center text-accent font-bold tracking-widest text-sm uppercase">
                                <History className="mr-2 h-4 w-4" /> Est. 1993
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">A Foundation of Excellence</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Ramba Exports was founded in 1993 as a manufacturing and exporting firm specializing in shawls, stoles, and textile-based products. Established with a strong foundation in textile production, the company has grown steadily over the decades while remaining committed to quality, consistency, and ethical business practices.
                            </p>
                        </div>

                        {/* Experience */}
                        <div className="relative pl-8 border-l-2 border-accent/30">
                            <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent"></span>
                            <div className="mb-2 flex items-center text-accent font-bold tracking-widest text-sm uppercase">
                                <Globe className="mr-2 h-4 w-4" /> Global Presence
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Three Decades of Trust</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                With more than three decades of experience, Ramba Exports is recognized as one of the oldest companies in this segment, having witnessed and adapted to evolving global market requirements, trends, and compliance standards. Our long-standing presence reflects not only continuity but also the trust placed in us by buyers across international markets.
                            </p>
                        </div>

                        {/* Affiliations */}
                        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-100">
                            <div className="mb-6 flex items-center justify-center text-accent">
                                <ShieldCheck className="h-12 w-12" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center">Recognized & Approved</h2>
                            <p className="text-lg text-gray-600 leading-relaxed text-center mb-8">
                                We are a registered and approved enterprise affiliated with leading Indian trade and export bodies. These affiliations reflect our compliance with national export standards and our commitment to transparent and responsible trade practices.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                                {['MSME', 'Ministry of Commerce', 'WEPCH', 'EPCH'].map((item) => (
                                    <span key={item} className="px-6 py-2 bg-white rounded-full shadow-sm text-primary font-medium border border-gray-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Evolution */}
                        <div className="relative pl-8 border-l-2 border-accent/30">
                            <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent"></span>
                            <div className="mb-2 flex items-center text-accent font-bold tracking-widest text-sm uppercase">
                                <Award className="mr-2 h-4 w-4" /> Craft & Innovation
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Evolving Capabilities</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Over the years, we have strengthened our capabilities across manufacturing, finishing, customization, and export operations. By combining traditional textile knowledge with modern production processes, we continue to support global buyers with both standard collections and custom-developed products.
                            </p>
                        </div>

                        {/* Conclusion */}
                        <div className="text-center pt-8">
                            <h3 className="text-2xl font-serif font-medium text-primary italic mb-6">
                                "Today, Ramba Exports stands as a legacy-driven organization focused on long-term partnerships, consistent quality, and reliable execution."
                            </h3>
                            <div className="w-24 h-1 bg-accent mx-auto"></div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
