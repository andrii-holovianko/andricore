#!/usr/bin/env bash
# Uploads generated pages to DA, then previews and publishes them.
# usage: DA_TOKEN=... ./publish.sh index blog/index nav footer
# The token is an Adobe IMS access token from da.live (see docs/SETUP.uk.md).
set -euo pipefail
ORG=andrii-holovianko
SITE=andricore
cd "$(dirname "$0")"
: "${DA_TOKEN:?set DA_TOKEN}"
for page in "$@"; do
  curl -fsS -o /dev/null -X PUT -H "Authorization: Bearer $DA_TOKEN" \
    -F "data=@out/$page.html;type=text/html" \
    "https://admin.da.live/source/$ORG/$SITE/$page.html"
  path="$page"; [ "${page##*/}" = index ] && path="${page%index}"
  for action in preview live; do
    curl -fsS -o /dev/null -X POST -H "Authorization: Bearer $DA_TOKEN" \
      "https://admin.hlx.page/$action/$ORG/$SITE/main/$path"
  done
  echo "published /$path"
done
