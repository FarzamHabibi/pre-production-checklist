#!/usr/bin/env bash
# Regenerate everything derived from the Markdown checklists:
#   data/checklist.json     machine-readable layer
#   checklists/README.md    index with item counts
#   ALL.md                  single-file concatenation
# Markdown under checklists/ is the source of truth. Never edit the outputs by hand.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/build_data.py
python3 scripts/build_index.py
python3 scripts/build_single_file.py
echo "done — review 'git diff' before committing"
