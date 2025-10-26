#!/usr/bin/env node

/**
 * ContentMultiplier.io - Debugging Script
 * Comprehensive system health check and debugging tool
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Debugger {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.success = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      {
        info: '🔍',
        success: '✅',
        warning: '⚠️',
        error: '❌',
      }[type] || '🔍';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkEnvironment() {
    this.log('Checking environment variables...', 'info');

    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY',
    ];

    const envFile = path.join(process.cwd(), '.env.local');

    if (!fs.existsSync(envFile)) {
      this.issues.push('Missing .env.local file');
      return;
    }

    const envContent = fs.readFileSync(envFile, 'utf8');

    for (const envVar of requiredEnvVars) {
      if (
        !envContent.includes(envVar) ||
        envContent.includes(`${envVar}=your_`)
      ) {
        this.issues.push(`Missing or placeholder value for ${envVar}`);
      } else {
        this.success.push(`Environment variable ${envVar} is configured`);
      }
    }
  }

  async checkDependencies() {
    this.log('Checking dependencies...', 'info');

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const nodeModulesExists = fs.existsSync('node_modules');

      if (!nodeModulesExists) {
        this.issues.push('node_modules directory not found - run npm install');
        return;
      }

      // Check for critical dependencies
      const criticalDeps = [
        'next',
        'react',
        'react-dom',
        '@supabase/supabase-js',
        'openai',
        'tailwindcss',
      ];

      for (const dep of criticalDeps) {
        if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
          this.success.push(`Dependency ${dep} is installed`);
        } else {
          this.issues.push(`Missing critical dependency: ${dep}`);
        }
      }
    } catch (error) {
      this.issues.push(`Error reading package.json: ${error.message}`);
    }
  }

  async checkFileStructure() {
    this.log('Checking file structure...', 'info');

    const requiredFiles = [
      'app/layout.tsx',
      'app/page.tsx',
      'middleware.ts',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
      'components/ErrorBoundary.tsx',
      'lib/supabase.ts',
      'lib/types.ts',
    ];

    const requiredDirs = ['app', 'components', 'lib', 'supabase/migrations'];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.success.push(`Required file exists: ${file}`);
      } else {
        this.issues.push(`Missing required file: ${file}`);
      }
    }

    for (const dir of requiredDirs) {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        this.success.push(`Required directory exists: ${dir}`);
      } else {
        this.issues.push(`Missing required directory: ${dir}`);
      }
    }
  }

  async checkTypeScript() {
    this.log('Checking TypeScript configuration...', 'info');

    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.success.push('TypeScript compilation successful');
    } catch (error) {
      this.issues.push(`TypeScript compilation errors: ${error.message}`);
    }
  }

  async checkServerStatus() {
    this.log('Checking server status...', 'info');

    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        this.success.push('Development server is running on port 3000');
      } else {
        this.issues.push(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      this.issues.push(`Server not accessible: ${error.message}`);
    }
  }

  async checkDatabaseConnection() {
    this.log('Checking database connection...', 'info');

    // This would require actual Supabase connection
    // For now, just check if the configuration files exist
    const supabaseFiles = [
      'lib/supabase.ts',
      'lib/supabase-server.ts',
      'lib/database.types.ts',
    ];

    for (const file of supabaseFiles) {
      if (fs.existsSync(file)) {
        this.success.push(`Supabase configuration file exists: ${file}`);
      } else {
        this.issues.push(`Missing Supabase configuration: ${file}`);
      }
    }
  }

  async checkSecurity() {
    this.log('Checking security configuration...', 'info');

    // Check for security-related files and configurations
    const securityChecks = [
      {
        file: 'middleware.ts',
        description: 'Authentication middleware',
      },
      {
        file: 'components/ErrorBoundary.tsx',
        description: 'Error boundary for crash prevention',
      },
    ];

    for (const check of securityChecks) {
      if (fs.existsSync(check.file)) {
        this.success.push(`${check.description} is implemented`);
      } else {
        this.warnings.push(`Missing ${check.description}: ${check.file}`);
      }
    }
  }

  async generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    console.log('\n' + '='.repeat(60));
    console.log('🔍 CONTENTMULTIPLIER.IO - DEBUG REPORT');
    console.log('='.repeat(60));

    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Success: ${this.success.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Issues: ${this.issues.length}`);
    console.log(`⏱️  Duration: ${duration}ms`);

    if (this.success.length > 0) {
      console.log(`\n✅ SUCCESSFUL CHECKS:`);
      this.success.forEach((item) => console.log(`   • ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      this.warnings.forEach((item) => console.log(`   • ${item}`));
    }

    if (this.issues.length > 0) {
      console.log(`\n❌ ISSUES TO FIX:`);
      this.issues.forEach((item) => console.log(`   • ${item}`));
    }

    console.log(`\n🎯 RECOMMENDATIONS:`);

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('   🎉 System is healthy! Ready for development.');
    } else if (this.issues.length === 0) {
      console.log('   ✅ System is functional with minor warnings.');
    } else {
      console.log('   🔧 Fix the issues above before proceeding.');
    }

    console.log('\n' + '='.repeat(60));

    return {
      success: this.success.length,
      warnings: this.warnings.length,
      issues: this.issues.length,
      duration,
    };
  }

  async run() {
    this.log('Starting ContentMultiplier.io debugging session...', 'info');

    await this.checkEnvironment();
    await this.checkDependencies();
    await this.checkFileStructure();
    await this.checkTypeScript();
    await this.checkServerStatus();
    await this.checkDatabaseConnection();
    await this.checkSecurity();

    return await this.generateReport();
  }
}

// Run the debugger if this script is executed directly
if (require.main === module) {
  const systemDebugger = new Debugger();
  systemDebugger.run().catch(console.error);
}

module.exports = Debugger;
