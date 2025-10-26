import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Accessibility audit utility for testing components
 */
export class AccessibilityAudit {
  /**
   * Run accessibility audit on a rendered component
   */
  static async auditComponent(component: React.ReactElement) {
    const { container } = render(component);
    const results = await axe(container);
    return results;
  }

  /**
   * Run accessibility audit on a DOM element
   */
  static async auditElement(element: HTMLElement) {
    const results = await axe(element);
    return results;
  }

  /**
   * Check for common accessibility issues
   */
  static async checkCommonIssues(component: React.ReactElement) {
    const results = await this.auditComponent(component);

    const issues = {
      critical: results.violations.filter((v) => v.impact === 'critical'),
      serious: results.violations.filter((v) => v.impact === 'serious'),
      moderate: results.violations.filter((v) => v.impact === 'moderate'),
      minor: results.violations.filter((v) => v.impact === 'minor'),
    };

    return {
      hasViolations: results.violations.length > 0,
      violations: issues,
      summary: {
        total: results.violations.length,
        critical: issues.critical.length,
        serious: issues.serious.length,
        moderate: issues.moderate.length,
        minor: issues.minor.length,
      },
    };
  }

  /**
   * Generate accessibility report
   */
  static generateReport(auditResults: any) {
    const { hasViolations, violations, summary } = auditResults;

    if (!hasViolations) {
      return '✅ No accessibility violations found!';
    }

    let report = `❌ Found ${summary.total} accessibility violations:\n\n`;

    if (violations.critical.length > 0) {
      report += `🚨 Critical (${violations.critical.length}):\n`;
      violations.critical.forEach((violation: any) => {
        report += `  - ${violation.description}\n`;
        report += `    Help: ${violation.help}\n`;
        report += `    Impact: ${violation.impact}\n\n`;
      });
    }

    if (violations.serious.length > 0) {
      report += `⚠️ Serious (${violations.serious.length}):\n`;
      violations.serious.forEach((violation: any) => {
        report += `  - ${violation.description}\n`;
        report += `    Help: ${violation.help}\n`;
        report += `    Impact: ${violation.impact}\n\n`;
      });
    }

    if (violations.moderate.length > 0) {
      report += `⚡ Moderate (${violations.moderate.length}):\n`;
      violations.moderate.forEach((violation: any) => {
        report += `  - ${violation.description}\n`;
        report += `    Help: ${violation.help}\n`;
        report += `    Impact: ${violation.impact}\n\n`;
      });
    }

    if (violations.minor.length > 0) {
      report += `ℹ️ Minor (${violations.minor.length}):\n`;
      violations.minor.forEach((violation: any) => {
        report += `  - ${violation.description}\n`;
        report += `    Help: ${violation.help}\n`;
        report += `    Impact: ${violation.impact}\n\n`;
      });
    }

    return report;
  }
}

/**
 * Accessibility test helpers
 */
export const accessibilityHelpers = {
  /**
   * Check if element has proper ARIA labels
   */
  hasAriaLabel: (element: HTMLElement) => {
    return (
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.getAttribute('aria-label') !== null
    );
  },

  /**
   * Check if element is keyboard accessible
   */
  isKeyboardAccessible: (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];

    if (interactiveElements.includes(tagName)) {
      return element.getAttribute('tabindex') !== '-1';
    }

    return element.getAttribute('tabindex') !== null;
  },

  /**
   * Check if element has proper focus management
   */
  hasFocusManagement: (element: HTMLElement) => {
    return (
      element.hasAttribute('tabindex') ||
      element.tagName.toLowerCase() === 'button' ||
      element.tagName.toLowerCase() === 'a' ||
      element.tagName.toLowerCase() === 'input' ||
      element.tagName.toLowerCase() === 'select' ||
      element.tagName.toLowerCase() === 'textarea'
    );
  },

  /**
   * Check if element has proper color contrast
   */
  hasColorContrast: (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    // This is a simplified check - in real implementation,
    // you'd use a library like color-contrast-checker
    return color !== backgroundColor;
  },

  /**
   * Check if element has proper semantic structure
   */
  hasSemanticStructure: (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const semanticElements = [
      'main',
      'nav',
      'header',
      'footer',
      'section',
      'article',
      'aside',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'ul',
      'ol',
      'li',
    ];

    return semanticElements.includes(tagName) || element.hasAttribute('role');
  },
};

/**
 * Common accessibility test patterns
 */
export const accessibilityPatterns = {
  /**
   * Test form accessibility
   */
  testFormAccessibility: async (formElement: HTMLElement) => {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    const labels = formElement.querySelectorAll('label');

    const issues = [];

    inputs.forEach((input, index) => {
      const inputElement = input as HTMLInputElement;

      // Check if input has associated label
      if (!inputElement.labels || inputElement.labels.length === 0) {
        issues.push(`Input ${index + 1} missing label`);
      }

      // Check if input has proper type
      if (
        inputElement.type === 'text' &&
        !inputElement.hasAttribute('aria-label')
      ) {
        issues.push(
          `Input ${index + 1} should have aria-label or type attribute`
        );
      }
    });

    return issues;
  },

  /**
   * Test button accessibility
   */
  testButtonAccessibility: async (buttonElement: HTMLElement) => {
    const issues = [];

    // Check if button has accessible name
    if (
      !buttonElement.textContent?.trim() &&
      !buttonElement.getAttribute('aria-label')
    ) {
      issues.push('Button missing accessible name');
    }

    // Check if button is focusable
    if (buttonElement.getAttribute('tabindex') === '-1') {
      issues.push('Button not focusable');
    }

    return issues;
  },

  /**
   * Test navigation accessibility
   */
  testNavigationAccessibility: async (navElement: HTMLElement) => {
    const issues = [];

    // Check if nav has proper role
    if (
      !navElement.hasAttribute('role') &&
      navElement.tagName.toLowerCase() !== 'nav'
    ) {
      issues.push('Navigation missing proper role');
    }

    // Check if nav has proper landmark
    if (
      !navElement.hasAttribute('aria-label') &&
      !navElement.hasAttribute('aria-labelledby')
    ) {
      issues.push('Navigation missing accessible label');
    }

    return issues;
  },
};
