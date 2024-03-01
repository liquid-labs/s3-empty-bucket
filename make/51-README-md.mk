S3EB_README_BUILT:='README.md'
S3EB_README_SRC:=$(SRC)/docs/README-prefix.md $(SRC)/docs/README-suffix.md $(SRC)/cli/

BUILD_TARGETS+=$(S3EB_README_BUILT)

$(S3EB_README_BUILT): $(S3EB_README_SRC) $(SDLC_S_3_EMPTY_BUCKET_EXEC_JS) $(SDLC_ALL_NON_TEST_JS_FILES_SRC) jsdoc.config.json
	cp $(SRC)/docs/README-prefix.md $@
	npx jsdoc2md \
		--configure ./jsdoc.config.json \
		--files 'src/**/*' \
		--global-index-format list \
		--name-format \
		--plugin dmd-readme-api \
		>> $@
	$(SDLC_S_3_EMPTY_BUCKET_EXEC_JS) --document >> $@
	cat $(SRC)/docs/README-suffix.md >> $@