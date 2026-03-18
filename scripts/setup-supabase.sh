#!/bin/bash
set -e

# =============================================================================
# BOSSOM SUPABASE SETUP SCRIPT
# =============================================================================
# Applies the database schema to your Supabase project.
#
# USAGE:
#   SUPABASE_ACCESS_TOKEN=<token> bash scripts/setup-supabase.sh
#
# Get your personal access token from:
#   https://supabase.com/dashboard/account/tokens
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status()  { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# 1. Prerequisites
# ---------------------------------------------------------------------------
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Installing via Homebrew..."
    brew install supabase/tap/supabase
fi
print_success "Supabase CLI $(supabase --version) ready"

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    print_error "SUPABASE_ACCESS_TOKEN is not set."
    echo ""
    echo "  1. Go to https://supabase.com/dashboard/account/tokens"
    echo "  2. Click 'Generate new token', give it a name"
    echo "  3. Re-run this script with the token:"
    echo ""
    echo "     SUPABASE_ACCESS_TOKEN=<your-token> bash scripts/setup-supabase.sh"
    echo ""
    exit 1
fi

# ---------------------------------------------------------------------------
# 2. Extract project ref from .env.local
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.local"

if [ ! -f "$ENV_FILE" ]; then
    print_error ".env.local not found at $ENV_FILE"
    exit 1
fi

SUPABASE_URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' ')
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | cut -d '.' -f1)

if [ -z "$PROJECT_REF" ]; then
    print_error "Could not extract project ref from NEXT_PUBLIC_SUPABASE_URL in .env.local"
    exit 1
fi
print_status "Project ref: $PROJECT_REF"

# ---------------------------------------------------------------------------
# 3. Link project
# ---------------------------------------------------------------------------
cd "$SCRIPT_DIR/.."

print_status "Initializing local Supabase config..."
supabase init --force 2>/dev/null || true

print_status "Linking to Supabase project..."
supabase link --project-ref "$PROJECT_REF"
print_success "Linked to project $PROJECT_REF"

# ---------------------------------------------------------------------------
# 4. Apply schema
# ---------------------------------------------------------------------------
SCHEMA_FILE="database/schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file not found at $SCHEMA_FILE"
    exit 1
fi

TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIGRATION_DIR="supabase/migrations"
MIGRATION_FILE="$MIGRATION_DIR/${TIMESTAMP}_initial_schema.sql"
mkdir -p "$MIGRATION_DIR"

cp "$SCHEMA_FILE" "$MIGRATION_FILE"
print_success "Schema staged as migration: $MIGRATION_FILE"

print_status "Pushing schema to Supabase..."
supabase db push
print_success "Database schema applied!"

# ---------------------------------------------------------------------------
# 5. Generate TypeScript types (optional)
# ---------------------------------------------------------------------------
print_status "Generating TypeScript types..."
if supabase gen types typescript --project-id "$PROJECT_REF" > types/database.ts 2>/dev/null; then
    print_success "TypeScript types written to types/database.ts"
else
    print_warning "Type generation skipped (run manually: supabase gen types typescript --project-id $PROJECT_REF)"
fi

# ---------------------------------------------------------------------------
print_success "Bossom Supabase setup complete!"
echo ""
echo "Next steps:"
echo "  1. Enable email auth in Supabase dashboard → Authentication → Providers"
echo "  2. Create storage bucket 'mammograms' in Supabase dashboard → Storage"
echo "  3. Start the dev server: npm run dev"