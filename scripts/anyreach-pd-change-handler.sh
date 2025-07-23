#!/usr/bin/env bash
set -euo pipefail

PROFILE="${PROFILE:-default}"   # Pipedream CLI profile
DRY_RUN=false
BASE=""
HEAD=""

usage() {
  cat <<EOF
Usage: $0 --base BASE_REF --head HEAD_REF [--dry-run]
  --base       Git ref to diff from
  --head       Git ref to diff to
  --dry-run    Only print actions; don’t call pd publish/unpublish
Requires env var PROFILE for \`--profile\` (defaults to \`default\`).
EOF
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --base)    BASE="$2"; DRY_RUN_VAL="$2"; shift 2;;
    --head)    HEAD="$2"; shift 2;;
    --dry-run) DRY_RUN=true; shift;;
    *)         echo "Unknown arg: $1"; usage;;
  esac
done
[[ -n "$BASE" && -n "$HEAD" ]] || usage

# 1) Get changed files under any actions directory
mapfile -t changes < <(
  git diff --name-status "$BASE" "$HEAD" \
    | grep '/actions/' \
    | awk '{print $1 "|" $2}'
)
if [[ ${#changes[@]} -eq 0 ]]; then
  echo "No changed files under actions directories."
  exit 0
fi

echo "Processing ${#changes[@]} changed file(s) under actions/:"

# 2) For each change decide action
for entry in "${changes[@]}"; do
  status="${entry%%|*}"     # A, M, D, ...
  path="${entry#*|}"        # filepath
  filename="$(basename "$path")"
  key="${filename%.*}"      # strip extension for component key

  # Determine what to do:
  if [[ "$status" == "D" ]]; then
    action="unpublish"
  elif [[ "$filename" == *-unpublished.* ]]; then
    # files ending in -unpublished.mjs
    if [[ "$status" == "M" ]]; then
      action="unpublish"
    else
      action="noaction"
    fi
  else
    # additions or modifications without suffix
    action="publish"
  fi

  echo "- $path → $action"

  # 3) Invoke the CLI (unless dry-run)
  if ! $DRY_RUN; then
    case "$action" in
      publish)
        pd publish "$path" --profile "$PROFILE"    # :contentReference[oaicite:0]{index=0}
        ;;
      unpublish)
        pd unpublish component "$key" --profile "$PROFILE"    # :contentReference[oaicite:1]{index=1}
        ;;
      noaction)
        ;;
      *)
        echo "Error: unknown action '$action' for $path" >&2
        ;;
    esac
  fi
done
