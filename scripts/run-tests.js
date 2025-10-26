#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive test runner for the frontend architecture review
 */
class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, total: 0 },
      integration: { passed: 0, failed: 0, total: 0 },
      accessibility: { passed: 0, failed: 0, total: 0 },
      performance: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 },
    };
    this.startTime = Date.now();
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting comprehensive test suite...\n');

    try {
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runAccessibilityTests();
      await this.runPerformanceTests();
      await this.runE2ETests();

      this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Run unit tests for hooks
   */
  async runUnitTests() {
    console.log('📋 Running unit tests for custom hooks...');

    try {
      const output = execSync(
        'npm run test -- --testPathPattern="__tests__/lib/hooks" --verbose',
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      this.parseTestOutput(output, 'unit');
      console.log('✅ Unit tests completed\n');
    } catch (error) {
      console.error('❌ Unit tests failed:', error.message);
      this.results.unit.failed++;
      this.results.unit.total++;
    }
  }

  /**
   * Run integration tests for components
   */
  async runIntegrationTests() {
    console.log('🔗 Running integration tests for refactored components...');

    try {
      const output = execSync(
        'npm run test -- --testPathPattern="__tests__/components/dashboard" --verbose',
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      this.parseTestOutput(output, 'integration');
      console.log('✅ Integration tests completed\n');
    } catch (error) {
      console.error('❌ Integration tests failed:', error.message);
      this.results.integration.failed++;
      this.results.integration.total++;
    }
  }

  /**
   * Run accessibility tests
   */
  async runAccessibilityTests() {
    console.log('♿ Running accessibility tests...');

    try {
      const output = execSync(
        'npm run test -- --testPathPattern="accessibility" --verbose',
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      this.parseTestOutput(output, 'accessibility');
      console.log('✅ Accessibility tests completed\n');
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      this.results.accessibility.failed++;
      this.results.accessibility.total++;
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests() {
    console.log('⚡ Running performance tests...');

    try {
      const output = execSync(
        'npm run test -- --testPathPattern="performance" --verbose',
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      this.parseTestOutput(output, 'performance');
      console.log('✅ Performance tests completed\n');
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      this.results.performance.failed++;
      this.results.performance.total++;
    }
  }

  /**
   * Run E2E tests
   */
  async runE2ETests() {
    console.log('🌐 Running E2E tests...');

    try {
      const output = execSync('npm run test:e2e', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      this.parseTestOutput(output, 'e2e');
      console.log('✅ E2E tests completed\n');
    } catch (error) {
      console.error('❌ E2E tests failed:', error.message);
      this.results.e2e.failed++;
      this.results.e2e.total++;
    }
  }

  /**
   * Parse test output to extract results
   */
  parseTestOutput(output, testType) {
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    let total = 0;

    for (const line of lines) {
      if (line.includes('Tests:')) {
        const match = line.match(/(\d+) passed|(\d+) failed|(\d+) total/);
        if (match) {
          if (match[1]) passed = parseInt(match[1]);
          if (match[2]) failed = parseInt(match[2]);
          if (match[3]) total = parseInt(match[3]);
        }
      }
    }

    this.results[testType].passed = passed;
    this.results[testType].failed = failed;
    this.results[testType].total = total;
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const totalPassed = Object.values(this.results).reduce(
      (sum, result) => sum + result.passed,
      0
    );
    const totalFailed = Object.values(this.results).reduce(
      (sum, result) => sum + result.failed,
      0
    );
    const totalTests = totalPassed + totalFailed;

    console.log('📊 Test Results Summary');
    console.log('========================');
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(
      `📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`
    );
    console.log('');

    // Detailed results
    Object.entries(this.results).forEach(([type, result]) => {
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(
        `${status} ${type.toUpperCase()}: ${result.passed}/${result.total} passed`
      );
    });

    console.log('');

    // Generate HTML report
    this.generateHTMLReport(duration, totalPassed, totalFailed, totalTests);

    // Exit with appropriate code
    if (totalFailed > 0) {
      process.exit(1);
    }
  }

  /**
   * Generate HTML test report
   */
  generateHTMLReport(duration, totalPassed, totalFailed, totalTests) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Architecture Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8fafc; padding: 20px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #374151; }
        .metric .value { font-size: 2em; font-weight: bold; margin: 0; }
        .success { color: #059669; }
        .error { color: #dc2626; }
        .warning { color: #d97706; }
        .details { margin-top: 30px; }
        .test-type { margin-bottom: 20px; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
        .test-type h3 { margin: 0 0 10px 0; color: #374151; }
        .test-results { display: flex; gap: 20px; }
        .test-result { flex: 1; text-align: center; }
        .test-result .number { font-size: 1.5em; font-weight: bold; }
        .timestamp { color: #6b7280; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Frontend Architecture Test Report</h1>
            <p>Comprehensive testing results for refactored components and custom hooks</p>
        </div>
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <h3>Total Tests</h3>
                    <p class="value">${totalTests}</p>
                </div>
                <div class="metric">
                    <h3>Passed</h3>
                    <p class="value success">${totalPassed}</p>
                </div>
                <div class="metric">
                    <h3>Failed</h3>
                    <p class="value ${totalFailed > 0 ? 'error' : 'success'}">${totalFailed}</p>
                </div>
                <div class="metric">
                    <h3>Success Rate</h3>
                    <p class="value ${totalFailed > 0 ? 'warning' : 'success'}">${((totalPassed / totalTests) * 100).toFixed(1)}%</p>
                </div>
                <div class="metric">
                    <h3>Duration</h3>
                    <p class="value">${(duration / 1000).toFixed(2)}s</p>
                </div>
            </div>
            
            <div class="details">
                <h2>Test Results by Category</h2>
                ${Object.entries(this.results)
                  .map(
                    ([type, result]) => `
                    <div class="test-type">
                        <h3>${type.toUpperCase()}</h3>
                        <div class="test-results">
                            <div class="test-result">
                                <div class="number success">${result.passed}</div>
                                <div>Passed</div>
                            </div>
                            <div class="test-result">
                                <div class="number ${result.failed > 0 ? 'error' : 'success'}">${result.failed}</div>
                                <div>Failed</div>
                            </div>
                            <div class="test-result">
                                <div class="number">${result.total}</div>
                                <div>Total</div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
            
            <div class="timestamp">
                Generated on ${new Date().toLocaleString()}
            </div>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('test-report.html', html);
    console.log('📄 HTML report generated: test-report.html');
  }
}

// Run the tests
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests();
}

module.exports = TestRunner;
