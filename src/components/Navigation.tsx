import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="text-2xl font-bold text-amber-500">
                        Lumyx
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-300 hover:text-amber-500"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            href="/services"
                            className={`${isActive('/services') ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                            Services
                        </Link>
                        <Link 
                            href="/portfolio"
                            className={`${isActive('/portfolio') ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                            Portfolio
                        </Link>
                        <Link 
                            href="/blog"
                            className={`${isActive('/blog') ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                            Blog
                        </Link>
                        <Link 
                            href="/about"
                            className={`${isActive('/about') ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                            About
                        </Link>
                        <Link 
                            href="/contact"
                            className={`${isActive('/contact') ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
                    <div className="flex flex-col space-y-4">
                        <Link
                            href="/services"
                            className="text-[var(--text-light)] hover:text-[var(--primary-orange)]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Services
                        </Link>
                        <Link
                            href="/case-studies"
                            className="text-[var(--text-light)] hover:text-[var(--primary-orange)]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Case Studies
                        </Link>
                        <Link
                            href="/blog"
                            className="text-[var(--text-light)] hover:text-[var(--primary-orange)]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/contact"
                            className="text-[var(--text-light)] hover:text-[var(--primary-orange)]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 