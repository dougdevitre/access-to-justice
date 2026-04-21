# Data

Machine-readable metadata exports derived from the framework documents.

## Files

### `metrics.json`

The complete 72-metric catalog as structured JSON. Generated from `scripts/build/_data.js`.

**Schema:**

```json
{
  "catalog_version": "v0.3.0",
  "generated": "ISO-8601 timestamp",
  "methodology_status": "draft" | "reviewed" | "adopted",
  "total_metrics": 72,
  "roles": [
    {"id": "parent", "name": "Parent (Pro Se)", "prefix": "p-"}
    // 14 entries
  ],
  "tier_labels": {
    "A": "Public",
    "B": "Oversight · DUA",
    "C": "User-Owned",
    "D": "Never Disclosed"
  },
  "metrics": [
    {
      "id": "p-typical-timeline",
      "role": "Parent (Pro Se)",
      "name": "Typical Case Timeline (County)",
      "tier": "A",
      "tier_label": "Public",
      "status": "visible",
      "description": "Median and P90 days from filing to final judgment...",
      "specification": {
        "definition": "...",
        "numerator": "...",
        "denominator": "...",
        "period": "...",
        "source": "...",
        "inclusion": "...",
        "exclusion": "...",
        "confounders": "...",
        "min_sample": "...",
        "privacy": "...",
        "reform_value": "...",
        "refresh": "..."
      }
    }
    // ... 72 entries
  ]
}
```

**Usage:**

```bash
# Count metrics by tier
cat data/metrics.json | jq '.metrics | group_by(.tier) | map({tier: .[0].tier, count: length})'

# Find all Tier A visible metrics
cat data/metrics.json | jq '.metrics[] | select(.tier == "A" and .status == "visible") | .name'

# Export metrics for a specific role
cat data/metrics.json | jq '.metrics[] | select(.role == "Judge")'
```

## What is NOT in this directory

- **Coercive-control metrics** from the mini-binder (CC-04) are NOT included in this export. They are in draft-for-expert-review status and will be added only after the Expert Review Convening validates them. See [docs/07-coercive-control/cc-04-metric-additions.docx](../docs/07-coercive-control/cc-04-metric-additions.docx) for the proposed additions.
- **Production data** (actual metric values, case counts, aggregate results). This repository contains only the framework and methodology; no real data is present.
- **Individual case data** of any kind, ever. This is a deliberate architectural decision. The repository's integrity depends on individual data never being committed here.

## Regenerating

```bash
cd scripts/build
node -e "const d = require('./_data'); const fs = require('fs'); /* see CI for full export logic */"
```

The canonical export logic lives in the CI workflow. Manual regeneration follows the same pattern.

## Stability

The `metrics.json` schema is stable within a major version. Fields may be added; fields will not be removed or renamed without a major version bump. Downstream tools should handle unknown fields gracefully.

## License

This file is licensed CC-BY-4.0 like the rest of the documentation. Attribution required per the main [LICENSE](../LICENSE).
