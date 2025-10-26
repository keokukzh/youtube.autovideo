import React from 'react';
import { FooterLinks } from './FooterLinks';

/**
 * Footer component with links and copyright
 */
export default function Footer() {
  const linkGroups = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'API', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold">ContentMultiplier.io</h3>
            <p className="text-gray-400">
              AI-powered content repurposing for the modern creator.
            </p>
          </div>

          {linkGroups.map((group, index) => (
            <FooterLinks key={index} title={group.title} links={group.links} />
          ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 ContentMultiplier.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
