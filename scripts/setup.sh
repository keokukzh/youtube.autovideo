#!/bin/bash

# ContentMultiplier.io Project Setup Script
# This script sets up a new project from the template

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check git
    if ! command_exists git; then
        print_error "git is not installed. Please install git and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to get project details
get_project_details() {
    print_status "Getting project details..."
    
    # Get project name
    read -p "Enter project name (default: my-saas-app): " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-my-saas-app}
    
    # Get project description
    read -p "Enter project description (default: A Next.js SaaS application): " PROJECT_DESCRIPTION
    PROJECT_DESCRIPTION=${PROJECT_DESCRIPTION:-A Next.js SaaS application}
    
    # Get author name
    read -p "Enter author name (default: Developer): " AUTHOR_NAME
    AUTHOR_NAME=${AUTHOR_NAME:-Developer}
    
    # Get author email
    read -p "Enter author email (default: developer@example.com): " AUTHOR_EMAIL
    AUTHOR_EMAIL=${AUTHOR_EMAIL:-developer@example.com}
    
    print_success "Project details collected"
}

# Function to create project directory
create_project_directory() {
    print_status "Creating project directory..."
    
    if [ -d "$PROJECT_NAME" ]; then
        print_warning "Directory $PROJECT_NAME already exists"
        read -p "Do you want to remove it and continue? (y/N): " REMOVE_EXISTING
        if [[ $REMOVE_EXISTING =~ ^[Yy]$ ]]; then
            rm -rf "$PROJECT_NAME"
            print_success "Removed existing directory"
        else
            print_error "Cannot continue with existing directory"
            exit 1
        fi
    fi
    
    mkdir -p "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    print_success "Project directory created: $PROJECT_NAME"
}

# Function to copy template files
copy_template_files() {
    print_status "Copying template files..."
    
    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    TEMPLATE_DIR="$SCRIPT_DIR/../templates/nextjs-saas"
    
    if [ ! -d "$TEMPLATE_DIR" ]; then
        print_error "Template directory not found: $TEMPLATE_DIR"
        exit 1
    fi
    
    # Copy all template files
    cp -r "$TEMPLATE_DIR"/* .
    
    print_success "Template files copied"
}

# Function to update package.json
update_package_json() {
    print_status "Updating package.json..."
    
    # Update package.json with project details
    sed -i.bak "s/\"name\": \"contentmultiplier\"/\"name\": \"$PROJECT_NAME\"/g" package.json
    sed -i.bak "s/\"description\": \"A complete SaaS application\"/\"description\": \"$PROJECT_DESCRIPTION\"/g" package.json
    sed -i.bak "s/\"author\": \"ContentMultiplier Team\"/\"author\": \"$AUTHOR_NAME <$AUTHOR_EMAIL>\"/g" package.json
    
    # Remove backup file
    rm package.json.bak
    
    print_success "package.json updated"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ ! -f ".env.local" ]; then
        cp env.example .env.local
        print_success "Environment file created: .env.local"
        print_warning "Please update .env.local with your actual API keys"
    else
        print_warning "Environment file already exists"
    fi
}

# Function to initialize git repository
init_git_repository() {
    print_status "Initializing git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit from template"
        print_success "Git repository initialized"
    else
        print_warning "Git repository already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    npm install
    
    print_success "Dependencies installed"
}

# Function to run initial setup
run_initial_setup() {
    print_status "Running initial setup..."
    
    # Run type checking
    npm run type-check
    
    # Run formatting
    npm run format
    
    print_success "Initial setup completed"
}

# Function to display next steps
display_next_steps() {
    print_success "Project setup completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Update .env.local with your API keys:"
    echo "   - Supabase URL and keys"
    echo "   - Stripe keys"
    echo "   - OpenAI API key (if using AI features)"
    echo
    echo "2. Set up your database:"
    echo "   - Create a Supabase project"
    echo "   - Run migrations: supabase db push"
    echo "   - Generate types: supabase gen types typescript --local > lib/database.types.ts"
    echo
    echo "3. Start development:"
    echo "   cd $PROJECT_NAME"
    echo "   npm run dev"
    echo
    echo "4. Run tests:"
    echo "   npm run test"
    echo "   npm run test:e2e"
    echo
    echo "5. Deploy to Vercel:"
    echo "   - Push to GitHub"
    echo "   - Connect to Vercel"
    echo "   - Add environment variables"
    echo
    echo "For more information, see the README.md file"
}

# Main function
main() {
    echo "🚀 ContentMultiplier.io Project Setup Script"
    echo "=============================================="
    echo
    
    check_prerequisites
    get_project_details
    create_project_directory
    copy_template_files
    update_package_json
    create_env_file
    init_git_repository
    install_dependencies
    run_initial_setup
    display_next_steps
}

# Run main function
main "$@"
