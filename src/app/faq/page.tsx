
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FAQList } from '@/components/faq/FAQList';

export default function FAQPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                        <p className="text-lg text-gray-600">Find answers to common questions about our products and services.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                        <FAQList />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
