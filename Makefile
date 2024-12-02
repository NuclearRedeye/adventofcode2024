PROJECT := $(notdir $(CURDIR))

# Targets that don't result in output of the same name.
.PHONY: distclean \
        start

# When no target is specified, the default target to run.
.DEFAULT_GOAL := start

# Target that cleans build output and local dependencies.
distclean: clean
	@rm -rf node_modules

# Target to install Node.js dependencies.
node_modules: package.json
	@echo "Installing dependencies..."
	@npm install
	@-touch node_modules

# Execute the exercise.
start: node_modules
	@node --experimental-strip-types ./src/day1.ts