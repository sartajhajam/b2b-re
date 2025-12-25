"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "Do you accept custom designs or private label orders?",
        answer: "Yes. We support custom designs, private labeling, and OEM/ODM orders. Buyers may share reference designs, artwork, or concepts, and our team will assist in development."
    },
    {
        question: "What fabrics and materials do you work with?",
        answer: "We work with a wide range of materials including cotton, organic cotton, modal, viscose/rayon, silk, wool, cashmere, pashmina, linen, bamboo, and blended fabrics. Fabric availability depends on season and order specifications."
    },
    {
        question: "What is your minimum order quantity (MOQ)?",
        answer: "MOQ varies depending on the product, fabric, and level of customization. Flexible MOQs are available for select items. Please contact us with your requirements for confirmation."
    },
    {
        question: "Do you provide samples?",
        answer: "Yes. Samples can be developed on request. Sample charges may apply depending on fabric and workmanship and are adjustable against confirmed bulk orders."
    },
    {
        question: "What is the production lead time?",
        answer: "Production lead time typically ranges between 20–45 days after sample approval and order confirmation. Timelines may vary based on order quantity and customization."
    },
    {
        question: "Can you do custom printing and embroidery?",
        answer: "Yes. We offer custom fabric printing, machine embroidery, hand embroidery, and other value-added finishes as per buyer specifications."
    },
    {
        question: "How do you ensure quality?",
        answer: "All products undergo quality checks at multiple stages, including fabric inspection, in-process checks, and final inspection before dispatch."
    },
    {
        question: "What are the standard industry sizes for your products?",
        answer: "We follow widely accepted international industry standards for our products. The typical sizes are as follows:\n\nStole: 70 × 180 cm\nShawl: 100 × 200 cm\nMuffler: 30 × 160 cm\nScarf (Long): 50 × 180 cm\nScarf (Square): 90 × 90 cm\n\nPlease note that minor size variations of ±2–3 cm may occur due to hand finishing and fabric characteristics. Custom sizes can also be accommodated upon request."
    },
    {
        question: "Which countries do you export to?",
        answer: "We export to UAE, Middle East, Europe, UK, and other international markets. Export documentation and packing are handled as per destination requirements."
    },
    {
        question: "What are your packaging options?",
        answer: "We provide standard export packaging and also offer custom packaging, including branded labels, hang tags, and gift boxes upon request."
    },
    {
        question: "What payment terms do you accept?",
        answer: "Payment terms are discussed at the time of order confirmation and may include advance payment, bank transfer (TT), or other mutually agreed terms."
    },
    {
        question: "How can I place an order or request a quotation?",
        answer: "You can reach us through the Contact Us page or send us your inquiry with product details, quantity, and destination. Our team will respond promptly."
    }
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="flex w-full items-center justify-between py-4 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <p className="pb-4 text-gray-600 whitespace-pre-line">{answer}</p>
            </div>
        </div>
    );
};

export const FAQList = () => {
    return (
        <div className="space-y-1">
            {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    );
};
