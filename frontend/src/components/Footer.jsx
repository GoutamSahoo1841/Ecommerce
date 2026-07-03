import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Globe, Users } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/search' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals' },
    { name: 'New Arrivals', href: '/search?sortBy=createdAt-desc' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Contact', icon: Mail, href: '#' },
  { name: 'Chat', icon: MessageSquare, href: '#' },
  { name: 'Website', icon: Globe, href: '#' },
  { name: 'Community', icon: Users, href: '#' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 text-left">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                NOVA
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Premium tech products for modern living. Experience the future of technology with our carefully curated collection.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 transition-all hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent shadow-xs"
                >
                  <social.icon className="h-4.5 w-4.5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3 text-left">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Shop</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Support</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-slate-100 dark:bg-slate-800/80" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-sm">
          <p className="text-slate-400 dark:text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} NOVA. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              Accepted payments:
            </span>
            <div className="flex gap-1.5">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((payment) => (
                <div
                  key={payment}
                  className="rounded-md border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-xs"
                >
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
