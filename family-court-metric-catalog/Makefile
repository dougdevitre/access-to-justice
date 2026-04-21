# Family Court Metric Catalog — build orchestration
# Usage: make <target>

.PHONY: help install build build-main build-cc build-specs build-budget validate clean all

BUILD_DIR := scripts/build
OUT_DIR := scripts/build/out

help:
	@echo "Family Court Metric Catalog — make targets"
	@echo ""
	@echo "  install        Install Node and Python dependencies"
	@echo "  build          Build all documents"
	@echo "  build-main     Build the main OSCA binder (22 docs)"
	@echo "  build-cc       Build the coercive-control mini-binder (8 docs)"
	@echo "  build-specs    Build the engineering specs (3 docs) + bench card"
	@echo "  build-budget   Build the budget workbook (xlsx)"
	@echo "  validate       Validate all generated documents"
	@echo "  metrics-json   Regenerate data/metrics.json from source data"
	@echo "  clean          Remove generated build artifacts"
	@echo "  all            install + build + validate"

install:
	@echo "Installing Node dependencies..."
	@cd $(BUILD_DIR) && npm install docx@^9.6.1
	@echo "Installing Python dependencies..."
	@pip install openpyxl --break-system-packages 2>/dev/null || pip install openpyxl

build: build-main build-cc build-specs build-budget
	@echo "✓ All documents built"

build-main:
	@echo "Building main OSCA binder (22 documents)..."
	@mkdir -p $(OUT_DIR)
	@cd $(BUILD_DIR) && node build-part-1.js
	@cd $(BUILD_DIR) && node build-part-2.js
	@cd $(BUILD_DIR) && node build-part-3.js
	@cd $(BUILD_DIR) && node build-part-4.js
	@cd $(BUILD_DIR) && node build-part-5.js
	@cd $(BUILD_DIR) && node build-part-6-adoption.js

build-cc:
	@echo "Building coercive-control mini-binder (8 documents)..."
	@mkdir -p /home/claude/coercive/out 2>/dev/null || true
	@cd $(BUILD_DIR) && node cc-build-1.js
	@cd $(BUILD_DIR) && node cc-build-2.js
	@cd $(BUILD_DIR) && node cc-build-3.js
	@cd $(BUILD_DIR) && node cc-build-4.js
	@cd $(BUILD_DIR) && node cc-build-5.js

build-specs:
	@echo "Building engineering specs and bench card..."
	@cd $(BUILD_DIR) && node build-spec-calculator.js
	@cd $(BUILD_DIR) && node build-specs-ux-cle.js
	@cd $(BUILD_DIR) && node build-bench-card.js

build-budget:
	@echo "Building budget workbook..."
	@cd $(BUILD_DIR) && python3 build_budget_xlsx.py

validate:
	@echo "Validating generated documents..."
	@for f in $(OUT_DIR)/*.docx; do \
		echo "  $$f"; \
	done
	@echo "(Schema validation requires docx skill validate.py in PATH)"

metrics-json:
	@cd $(BUILD_DIR) && node -e " \
		const d = require('./_data'); \
		const fs = require('fs'); \
		const metrics = Object.entries(d.METRICS).map(([id, m]) => ({ \
			id, role: m.role, name: m.name, tier: m.tier, \
			tier_label: d.TIER_LABEL[m.tier], status: m.status, \
			description: m.desc, \
			specification: { \
				definition: m.definition, numerator: m.numerator, \
				denominator: m.denominator, period: m.period, \
				source: m.source, inclusion: m.inclusion, \
				exclusion: m.exclusion, confounders: m.confounders, \
				min_sample: m.minSample, privacy: m.privacy, \
				reform_value: m.reformValue, refresh: m.refresh \
			} \
		})); \
		fs.writeFileSync('../../data/metrics.json', JSON.stringify({ \
			catalog_version: 'v0.3.0', \
			generated: new Date().toISOString(), \
			methodology_status: 'draft', \
			total_metrics: metrics.length, \
			roles: d.ROLES, \
			tier_labels: d.TIER_LABEL, \
			metrics \
		}, null, 2)); \
		console.log('Wrote', metrics.length, 'metrics');"

clean:
	@echo "Removing build artifacts..."
	@rm -rf $(OUT_DIR)
	@rm -rf /tmp/binder-build 2>/dev/null || true
	@rm -rf $(BUILD_DIR)/node_modules
	@echo "✓ Clean"

all: install build validate
	@echo "✓ Full build complete"
