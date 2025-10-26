import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UploadManager } from '@/components/dashboard/upload/UploadManager';
import { HistoryFilters } from '@/components/dashboard/history/HistoryFilters';
import { OutputCard } from '@/components/dashboard/outputs/OutputCard';
import { AccessibilityAudit } from '../utils/accessibility-audit';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the hooks
jest.mock('@/lib/hooks/use-credits', () => ({
  useCredits: jest.fn(() => ({
    credits: 50,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-generation-polling', () => ({
  useGenerationPolling: jest.fn(() => ({
    status: 'idle',
    progress: 0,
    message: '',
    error: null,
  })),
}));

jest.mock('@/lib/hooks/use-clipboard', () => ({
  useClipboard: jest.fn(() => ({
    copied: false,
    copyToClipboard: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-download', () => ({
  useDownload: jest.fn(() => ({
    downloading: false,
    downloadAsFile: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

jest.mock('@/lib/services/GenerationService', () => ({
  GenerationService: {
    generateContent: jest.fn(),
  },
}));

describe('Dashboard Components Accessibility', () => {
  describe('UploadManager', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<UploadManager />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form structure', async () => {
      const { container } = render(<UploadManager />);

      // Check for proper form elements
      expect(container.querySelector('form')).toBeInTheDocument();
      expect(container.querySelector('fieldset')).toBeInTheDocument();

      // Check for proper labels
      const inputs = container.querySelectorAll('input, textarea');
      inputs.forEach((input) => {
        const inputElement = input as HTMLInputElement;
        expect(
          inputElement.labels?.length > 0 ||
            inputElement.hasAttribute('aria-label') ||
            inputElement.hasAttribute('aria-labelledby')
        ).toBe(true);
      });
    });

    it('should have proper tab navigation', async () => {
      const { container } = render(<UploadManager />);

      // Check for proper tab structure
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBeGreaterThan(0);

      // Check for proper tabpanel structure
      const tabpanels = container.querySelectorAll('[role="tabpanel"]');
      expect(tabpanels.length).toBeGreaterThan(0);
    });
  });

  describe('HistoryFilters', () => {
    const defaultProps = {
      filters: {},
      onFiltersChange: jest.fn(),
      onClearFilters: jest.fn(),
    };

    it('should not have accessibility violations', async () => {
      const { container } = render(<HistoryFilters {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form controls', async () => {
      const { container } = render(<HistoryFilters {...defaultProps} />);

      // Check for proper select elements
      const selects = container.querySelectorAll('select');
      selects.forEach((select) => {
        const selectElement = select as HTMLSelectElement;
        expect(selectElement.hasAttribute('aria-label')).toBe(true);
      });

      // Check for proper input elements
      const inputs = container.querySelectorAll('input');
      inputs.forEach((input) => {
        const inputElement = input as HTMLInputElement;
        expect(inputElement.hasAttribute('aria-label')).toBe(true);
      });
    });

    it('should have proper button accessibility', async () => {
      const { container } = render(<HistoryFilters {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(
          button.textContent?.trim() || button.getAttribute('aria-label')
        ).toBeTruthy();
      });
    });
  });

  describe('OutputCard', () => {
    const mockOutput = {
      id: 'output-1',
      title: 'Twitter Post',
      content: 'This is a sample Twitter post content.',
      format: 'twitter',
      icon: 'Twitter',
    };

    const defaultProps = {
      output: mockOutput,
      onCopy: jest.fn(),
      onDownload: jest.fn(),
    };

    it('should not have accessibility violations', async () => {
      const { container } = render(<OutputCard {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', async () => {
      const { container } = render(<OutputCard {...defaultProps} />);

      const heading = container.querySelector('h3');
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe('Twitter Post');
    });

    it('should have proper button accessibility', async () => {
      const { container } = render(<OutputCard {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have proper content structure', async () => {
      const { container } = render(<OutputCard {...defaultProps} />);

      // Check for proper content display
      expect(container.querySelector('[role="article"]')).toBeInTheDocument();
      expect(container.textContent).toContain(
        'This is a sample Twitter post content.'
      );
    });
  });

  describe('Overall Dashboard Accessibility', () => {
    it('should have proper skip links', async () => {
      // This would test the layout component with skip links
      const skipLinks = document.querySelectorAll(
        'a[href="#main-content"], a[href="#navigation"]'
      );
      expect(skipLinks.length).toBeGreaterThan(0);
    });

    it('should have proper ARIA landmarks', async () => {
      // This would test the overall page structure
      const landmarks = document.querySelectorAll(
        '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]'
      );
      expect(landmarks.length).toBeGreaterThan(0);
    });
  });
});

describe('Accessibility Audit Integration', () => {
  it('should run comprehensive accessibility audit', async () => {
    const component = <UploadManager />;
    const auditResults = await AccessibilityAudit.checkCommonIssues(component);

    expect(auditResults.hasViolations).toBe(false);
    expect(auditResults.summary.total).toBe(0);
  });

  it('should generate accessibility report', async () => {
    const component = <UploadManager />;
    const auditResults = await AccessibilityAudit.checkCommonIssues(component);
    const report = AccessibilityAudit.generateReport(auditResults);

    expect(report).toContain('✅ No accessibility violations found!');
  });
});
