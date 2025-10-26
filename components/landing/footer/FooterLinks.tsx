import React from 'react';

interface FooterLinksProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

/**
 * Reusable footer link group component
 */
export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <ul className="space-y-2 text-gray-400">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
