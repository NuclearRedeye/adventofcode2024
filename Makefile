PROJECT := $(notdir $(CURDIR))

SOURCES=$(shell find ./src/* -name "day*" -exec basename {} \;)

# Targets that don't result in output of the same name.
.PHONY: distclean \
        start

# When no target is specified, the default target to run.
.DEFAULT_GOAL := start

# Target that cleans build output and local dependencies.
distclean:
	@rm -rf node_modules

# Target to install Node.js dependencies.
node_modules: package.json
	@echo "Installing dependencies..."
	@npm install
	@-touch node_modules

# Execute a specific exercise.
%.ts: node_modules
	@node --disable-warning=ExperimentalWarning --experimental-strip-types ./src/$@

# Execute ALL exercises.
start: $(SOURCES)