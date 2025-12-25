
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PolicyList } from '@/components/shipping/PolicyList';
import Link from 'next/link';

export default function ShippingPaymentsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow py-16 sm:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-primary sm:text-5xl mb-4">
                            Shipping & Payments
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive guide to our logistics, payment terms, and operational policies for a seamless partnership.
                        </p>
                    </div>

                    <div className="mb-16">
                        <PolicyList />
                    </div>

                    <div className="rounded-2xl bg-primary p-8 sm:p-12 text-center text-black relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-accent opacity-10 blur-3xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-serif font-bold mb-4">Need Clarification?</h3>
                            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                                For detailed shipping options, payment terms, or destination-specific requirements, our team is here to assist you.
                            </p>
                            <Link href="/custom-orders" className="inline-block bg-accent text-primary px-8 py-3 rounded-md font-bold hover:bg-white hover:text-primary transition-colors duration-300">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
