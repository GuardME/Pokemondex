#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating CI/CD Setup..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git repository detected${NC}"

# Check for GitHub workflows
if [ -d ".github/workflows" ]; then
    echo -e "${GREEN}✅ Workflows directory exists${NC}"
    
    # Count workflow files
    workflow_count=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    echo "   Found $workflow_count workflow file(s)"
    
    # List workflow files
    for file in .github/workflows/*.yml; do
        if [ -f "$file" ]; then
            echo "   - $(basename "$file")"
        fi
    done
else
    echo -e "${RED}❌ Workflows directory not found${NC}"
    exit 1
fi
echo ""

# Check for required workflow files
required_workflows=("ci.yml" "deploy-production.yml")
for workflow in "${required_workflows[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        echo -e "${GREEN}✅ $workflow exists${NC}"
    else
        echo -e "${RED}❌ $workflow missing${NC}"
    fi
done
echo ""

# Check for documentation files
echo "📚 Checking documentation files..."
docs=("README.md" "CI-CD.md" "DEPLOYMENT.md" "CONTRIBUTING.md" "CI-CD-SETUP-SUMMARY.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $doc exists${NC}"
    else
        echo -e "${YELLOW}⚠️  $doc missing${NC}"
    fi
done
echo ""

# Check for package.json scripts
echo "📦 Checking package.json scripts..."
if [ -f "package.json" ]; then
    if grep -q "release:patch" package.json; then
        echo -e "${GREEN}✅ Release scripts configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Release scripts not found${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
fi
echo ""

# Check if remote is GitHub
echo "🔗 Checking GitHub remote..."
remote_url=$(git config --get remote.origin.url)
if [[ $remote_url == *"github.com"* ]]; then
    echo -e "${GREEN}✅ GitHub remote configured${NC}"
    echo "   Remote: $remote_url"
else
    echo -e "${YELLOW}⚠️  Not a GitHub repository${NC}"
    echo "   Remote: $remote_url"
fi
echo ""

# Check for git tags
echo "🏷️  Checking git tags..."
tag_count=$(git tag | wc -l)
if [ "$tag_count" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $tag_count tag(s)${NC}"
    echo "   Latest tags:"
    git tag --sort=-version:refname | head -5 | sed 's/^/   - /'
else
    echo -e "${YELLOW}⚠️  No tags found${NC}"
    echo "   Create your first tag with: git tag v1.0.0"
fi
echo ""

# Check Node.js version
echo "🟢 Checking Node.js version..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $node_version${NC}"
    
    # Check if version is 18 or higher
    major_version=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
    if [ "$major_version" -ge 18 ]; then
        echo -e "${GREEN}   Version is compatible (18+)${NC}"
    else
        echo -e "${RED}   Version too old (need 18+)${NC}"
    fi
else
    echo -e "${RED}❌ Node.js not installed${NC}"
fi
echo ""

# Check if GitHub CLI is installed
echo "🔧 Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI installed${NC}"
    gh_version=$(gh --version | head -1)
    echo "   Version: $gh_version"
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed (optional)${NC}"
    echo "   Install with: brew install gh"
fi
echo ""

# Check if Vercel CLI is installed
echo "🔧 Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    vercel_version=$(vercel --version)
    echo "   Version: $vercel_version"
else
    echo -e "${YELLOW}⚠️  Vercel CLI not installed (needed for deployment)${NC}"
    echo "   Install with: npm install -g vercel"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SETUP SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if setup is complete
if [ -d ".github/workflows" ] && \
   [ -f ".github/workflows/ci.yml" ] && \
   [ -f ".github/workflows/deploy-production.yml" ] && \
   [ -f "README.md" ] && \
   [ -f "CI-CD.md" ]; then
    echo -e "${GREEN}✅ CI/CD setup is complete!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Push code to GitHub"
    echo "   2. Add GitHub Secrets (Vercel credentials)"
    echo "   3. Create first tag: git tag v1.0.0"
    echo "   4. Push tag: git push origin v1.0.0"
    echo ""
    echo "📖 See CI-CD-SETUP-SUMMARY.md for detailed setup instructions"
else
    echo -e "${RED}❌ CI/CD setup incomplete${NC}"
    echo ""
    echo "Missing components detected. Please ensure all files are present."
fi
echo ""

exit 0

