# Cleanup script for Next.js project

# Remove node_modules and .next directories
Remove-Item -Recurse -Force .next, node_modules -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install

# Build the project
npm run build
