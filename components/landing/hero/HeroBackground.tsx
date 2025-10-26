import React from 'react';

/**
 * Animated background component for the hero section
 * Features gradient overlays and SVG pattern
 */
export function HeroBackground() {
  return (
    <>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Visual Separator */}
      <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
    </>
  );
}
