'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const navItems = [
    { name: 'Games', href: '/games' },
    { name: 'GG Productions', href: '/gg-productions' },
    { name: 'About Us', href: '/about' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 w-full z-[9999] px-2 md:px-6 py-4 flex justify-between items-center">
            <Link href="/" className="relative w-12 h-12 md:w-20 md:h-20 block">
                <Image
                    src={pathname === '/gg-productions' ? '/logos/logo1black.png' : '/logos/logo1white.png'}
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </Link>

            <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar max-w-full">
                <ul className="flex items-center gap-1 md:gap-4">
                    {navItems.map((item) => {
                        const isGG = pathname === '/gg-productions';
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name} className="shrink-0">
                                <Link
                                    href={item.href}
                                    className={`block text-[10px] md:text-xs font-bold transition-all border px-2 md:px-5 py-1.5 md:py-2 whitespace-nowrap
                                    ${isGG
                                            ? `border-black/10 hover:bg-black hover:text-white text-black`
                                            : `border-white/10 hover:bg-white hover:text-black text-white`
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                <Link
                    href="/pitch"
                    className={`border px-2 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs font-bold transition-colors shrink-0 whitespace-nowrap
                        ${pathname === '/gg-productions'
                            ? 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-black'
                            : 'bg-white text-black border-white hover:bg-black hover:text-white hover:border-white'}`}
                >
                    Pitch Us
                </Link>
            </div>
        </nav>
    );
}
