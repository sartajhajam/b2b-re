import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-900 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="mb-8 md:mb-0 max-w-sm">
                        <h3 className="text-2xl font-serif font-bold text-accent mb-6">Ramba Exports</h3>
                        <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                            Manufacturing exquisite shawls, stoles, and kimonos since 1993.
                            Dedicated to quality, heritage, and sustainable partnerships.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-500 hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="text-gray-500 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="text-gray-500 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:gap-16">
                        <div>
                            <h4 className="text-sm font-bold text-black tracking-wider uppercase mb-5">Company</h4>
                            <ul className="space-y-3">
                                <li><Link href="/heritage" className="text-sm text-gray-600 hover:text-accent transition-colors">Our Heritage</Link></li>
                                <li><Link href="/craftsmanship" className="text-sm text-gray-600 hover:text-accent transition-colors">Craftsmanship</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-black tracking-wider uppercase mb-5">Buyer Information</h4>
                            <ul className="space-y-3">
                                <li><Link href="/faq" className="text-sm text-gray-600 hover:text-accent transition-colors">FAQ</Link></li>
                                <li><Link href="/custom-orders" className="text-sm text-gray-600 hover:text-accent transition-colors">Custom Orders</Link></li>
                                <li><Link href="/shipping-payments" className="text-sm text-gray-600 hover:text-accent transition-colors">Shipping & Payments</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-black tracking-wider uppercase mb-5">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-accent" />
                                    Export House,<br />FA-40 B Shaheen Bagh<br />Delhi-110025
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-accent" />
                                    +91 9667478513
                                    <a
                                        href="https://wa.me/919667478513"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-green-600 hover:text-green-700 transition-colors"
                                        title="Chat on WhatsApp"
                                    >
                                        <WhatsAppIcon className="h-5 w-5" />
                                    </a>
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-accent" />
                                    <div>
                                        <p className="mt-1">exportsramba@gmail.com</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs text-text-muted">
                        &copy; {new Date().getFullYear()} Ramba Exports. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 text-center md:text-right">
                        <p className="text-xs font-medium text-primary tracking-wide uppercase mb-1">Registered under Ministry of Commerce, Government of India</p>
                        <p className="text-[10px] text-text-muted">Office of the Joint Director General of Foreign Trade, New Delhi – 110025</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Registration No. 18/04/130/0091/AM04/22 | Dated: 08.09.2003</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
