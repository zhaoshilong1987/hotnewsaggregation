'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Flame, Heart, User } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: '热点',
      href: '/',
      icon: Flame,
    },
    {
      name: '收藏',
      href: '/favorites',
      icon: Heart,
    },
    {
      name: '我的',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
