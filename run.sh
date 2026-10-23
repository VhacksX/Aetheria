#!/usr/bin/env bash
# Quickstart script for Aetheria Celestial Observer
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "✨ Starting Aetheria Celestial Sky Observer (Apple UI v2.0)"
echo "=========================================================="

# Ensure documentation files exist
if [ ! -f "docs/ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf" ]; then
    echo "📄 Generating Architecture PDF and DOCX documentation..."
    python3 docs/generate_docs.py
fi

echo "🚀 Launching FastAPI server on http://localhost:8000"
echo "Press Ctrl+C to terminate."

PYTHONPATH=. python3 -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
