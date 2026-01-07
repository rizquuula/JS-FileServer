.PHONY: dev install clean deploy deploy-latest

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

# Deploy with Docker
deploy:
	docker compose up -d --build --force-recreate

# Deploy latest from git
deploy-latest:
	git pull && docker compose up -d --build --force-recreate