include ~/.aws_user_mutter

DOCS_MOUNT := mutterio/mini-hugo
DOCKER_RUN_DOCS := docker run --rm -it $(DOCS_MOUNT)
AWS_S3_BUCKET := mutter.io
build: .
	./bin/build

serve:
	./bin/dev

publish: build
	aws --profile mutter_deploy \
		s3 sync --acl public-read \
	 ./output s3://$(AWS_S3_BUCKET)
