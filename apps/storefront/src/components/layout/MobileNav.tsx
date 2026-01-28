'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import { Link } from '@/lib/navigation';

interface NavItem {
  href: string;
  labelKey: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
}

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const t = useTranslations('common');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-16 z-50 border-b bg-background p-4 shadow-lg md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={onClose}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
