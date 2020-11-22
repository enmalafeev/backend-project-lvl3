install: install-deps

run:
	node bin/pageloader.js  https://ru.hexlet.io/courses
	# https://enmalafeev.github.io/portfolio/dist/

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish --dry-run
.PHONY: test
