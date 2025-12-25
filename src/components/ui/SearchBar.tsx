'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?search=${encodeURIComponent(query)}`);
            setIsExpanded(false);
        }
    };

    return (
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-64 bg-gray-50 rounded-full border border-gray-200 pl-4 pr-2' : 'w-10'}`}>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, SKU..."
                    className={`bg-transparent border-none outline-none text-sm w-full transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}
                />
            </form>

            <button
                onClick={() => {
                    if (isExpanded && !query) {
                        setIsExpanded(false);
                    } else if (isExpanded && query) {
                        handleSubmit({ preventDefault: () => { } } as any);
                    } else {
                        setIsExpanded(true);
                    }
                }}
                className="p-2 text-text-muted hover:text-accent transition-colors cursor-pointer"
                aria-label="Search"
            >
                <Search className="h-5 w-5" />
            </button>

            {isExpanded && (
                <button
                    onClick={() => {
                        setIsExpanded(false);
                        setQuery('');
                    }}
                    className="p-1 ml-1 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
