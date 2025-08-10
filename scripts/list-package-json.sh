#!/bin/bash
find . -path '*/node_modules' -prune -o -name "package.json" \
-exec sh -c 'for f in "$@"; do echo "--- $f ---"; cat "$f"; echo; done' sh {} +