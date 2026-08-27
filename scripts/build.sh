#!/usr/bin/env bash
# Regenerate the generated artifacts:
#   - item counts in checklists/README.md
#   - ALL.md, the single-file concatenation
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/build_index.py
python3 scripts/build_single_file.py
echo "done — review 'git diff' before committing"
