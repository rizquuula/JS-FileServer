.PHONY: dev install clean

# Development server
dev:
	cd app && npm start

# Install dependencies
install:
	cd app && npm install

# Clean up
clean:
	cd app && rm -rf node_modules package-lock.json
	find . -name "*.log" -delete