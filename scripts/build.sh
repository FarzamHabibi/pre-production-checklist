#!/usr/bin/env bash
# Regenerate everything derived from the Markdown checklists:
#   data/checklist.json     machine-readable layer
#   README headline, package.json description, .github/description.txt
#   checklists/README.md    index with item counts
#   ALL.md                  single-file concatenation
#   demo/*.html             demo pages (index.html, chat.html)
# Markdown under checklists/ is the source of truth. Never edit the outputs by hand.
set -euo pipefail
cd "$(dirname "$0")/.."

# tree.py is imported by the scripts below; do not leave bytecode in the tree
export PYTHONDONTWRITEBYTECODE=1
python3 scripts/build_data.py
python3 scripts/build_meta.py
python3 scripts/build_index.py
python3 scripts/build_single_file.py
python3 scripts/build_demo.py
python3 scripts/build_chat.py
echo "done — review 'git diff' before committing"
