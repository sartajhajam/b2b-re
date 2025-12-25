"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const policies = [
    {
        title: "Shipping Methods",
        content: "We arrange shipments through reliable international logistics partners based on the destination, shipment volume, and buyer preference. Orders may be shipped via air freight, sea freight, or courier services."
    },
    {
        title: "Incoterms",
        content: "Unless otherwise agreed in writing, shipments are offered under standard international Incoterms® such as EXW, FOB, CFR, or CIF. The applicable Incoterm will be confirmed at the time of order confirmation."
    },
    {
        title: "Shipping Time",
        content: "Dispatch timelines depend on order quantity, customization, and production lead time.\n\nEstimated transit time varies by destination and shipping mode and will be shared once the shipment is booked.\n\nDelays caused by customs clearance, port congestion, weather conditions, or force majeure are beyond our control."
    },
    {
        title: "Packaging",
        content: "All goods are packed in standard export-quality packaging to ensure safe transit.\n\nCustom packaging, branded labels, hang tags, and special packing instructions are available upon request and may incur additional charges."
    },
    {
        title: "Customs, Duties & Taxes",
        content: "Import duties, customs clearance charges, and local taxes are the responsibility of the buyer, unless otherwise agreed under specific Incoterms.\n\nBuyers are advised to check local import regulations prior to placing an order."
    },
    {
        title: "Accepted Payment Methods",
        content: "We accept payments via:\n• Bank Transfer (TT / Wire Transfer)\n• Other mutually agreed international payment methods\n\nPayment details are shared upon order confirmation."
    },
    {
        title: "Payment Terms",
        content: "Standard payment terms are:\n• Advance payment prior to production, or\n• Part advance and balance before shipment, as mutually agreed\n\nPayment terms may vary based on order value, buyer history, and nature of the order."
    },
    {
        title: "Currency",
        content: "All transactions are conducted in EURO or other mutually agreed currencies. Bank charges, if any, are to be borne by the buyer."
    },
    {
        title: "Order Confirmation",
        content: "Production begins only after:\n• Final approval of samples (where applicable)\n• Written order confirmation\n• Receipt of agreed advance payment\n\nAny changes requested after confirmation may affect pricing and delivery timelines."
    },
    {
        title: "Cancellations & Modifications",
        content: "Orders cannot be cancelled once production has commenced.\n\nModifications after approval are subject to feasibility and may incur additional costs."
    },
    {
        title: "Quality & Claims",
        content: "Goods are inspected prior to dispatch.\n\nAny claims regarding quality or quantity must be communicated within a reasonable period after receipt of goods, along with supporting evidence."
    },
    {
        title: "Force Majeure",
        content: "We shall not be held liable for delays or non-performance due to events beyond our reasonable control, including but not limited to natural disasters, strikes, transport disruptions, or government restrictions."
    }
];

const PolicyItem = ({ title, content }: { title: string, content: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
            <button
                className="flex w-full items-center justify-between p-5 text-left focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-serif font-bold text-primary">{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-accent" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>
            <div
                className={`transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-5 text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100">
                    {content}
                </div>
            </div>
        </div>
    );
};

export const PolicyList = () => {
    return (
        <div className="space-y-4">
            {policies.map((policy, index) => (
                <PolicyItem key={index} title={policy.title} content={policy.content} />
            ))}
        </div>
    );
};
