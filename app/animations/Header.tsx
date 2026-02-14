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
                                    className={`relative block text-[10px] md:text-xs font-bold px-2 md:px-5 py-1.5 md:py-2 whitespace-nowrap overflow-hidden border transition-[background-size,color] duration-300 bg-no-repeat bg-left
                                    ${isGG
                                            ? `border-black/10 text-black hover:text-white bg-gradient-to-r from-black to-black`
                                            : `border-white/10 text-white hover:text-black bg-gradient-to-r from-white to-white`
                                        } bg-[length:0%_100%] hover:bg-[length:100%_100%]`}
                                >
                                    <span className="relative z-10">{item.name}</span>
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
