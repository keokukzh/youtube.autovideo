# Contributing to ContentMultiplier.io

Thank you for your interest in contributing to ContentMultiplier.io! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database access)
- OpenAI API key (for testing)

### Local Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/contentmultiplier.git
   cd contentmultiplier
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Update your `.env.local` with Supabase credentials

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Run tests to verify setup**
   ```bash
   npm run validate
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

Examples:

- `feature/stripe-webhook-integration`
- `fix/audio-upload-validation`
- `docs/api-documentation-update`

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(auth): add social login integration
fix(api): handle rate limiting errors gracefully
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following our code standards
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run the validation suite**:
   ```bash
   npm run validate
   ```
6. **Commit your changes** with conventional commit messages
7. **Push to your fork** and create a pull request
8. **Fill out the PR template** completely

### PR Requirements

Before submitting a pull request, ensure:

- [ ] All tests pass (`npm run test:ci`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] ESLint passes (`npm run lint`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Test coverage meets the 80% threshold
- [ ] Documentation is updated if needed
- [ ] Breaking changes are documented

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public functions
- Avoid `any` type - use `unknown` if needed
- Use proper error handling with typed errors

### React/Next.js

- Use Server Components by default
- Client Components only when necessary
- Prefer server actions over API routes
- Use proper error boundaries
- Implement loading states for async operations

### File Organization

- Keep files under 500 lines
- One component per file
- Use kebab-case for file names
- Group related files in directories
- Follow the established folder structure

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Files**: kebab-case (`user-profile.tsx`)
- **CSS Classes**: Tailwind utilities only

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for public functions
- Keep functions small and focused

## Testing Guidelines

### Unit Tests

- Write tests for all utility functions
- Test component behavior, not implementation
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

### Integration Tests

- Test API endpoints with real data flow
- Test database operations
- Test authentication flows
- Test error scenarios

### E2E Tests

- Test critical user journeys
- Test responsive design
- Test accessibility features
- Test error handling

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange
      const props = { ... };

      // Act
      const result = renderComponent(props);

      // Assert
      expect(result).toMatchSnapshot();
    });
  });
});
```

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, browser, Node version)
5. **Screenshots** if applicable
6. **Console errors** or logs

### Feature Requests

For feature requests, include:

1. **Problem description** - what need does this solve?
2. **Proposed solution** - how should it work?
3. **Alternatives considered** - other approaches?
4. **Additional context** - any other relevant information

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - Urgent issues
- `priority: medium` - Important but not urgent
- `priority: low` - Nice to have

## Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens
- Thunder Client (for API testing)

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript compiler
npm run validate        # Run all quality checks

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
```

## Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Ask for help in PR comments

## Release Process

1. All changes go through PR review
2. CI/CD pipeline must pass
3. Code is merged to `main` branch
4. Automatic deployment to production
5. Release notes are generated

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ContentMultiplier.io! 🚀
