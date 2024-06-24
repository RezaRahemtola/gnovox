package gnovox

import "errors"

var (
	ErrPostTitleMissing  = errors.New("post title is missing")
	ErrPostSlugMissing   = errors.New("post slug is missing")
	ErrPostBodyMissing   = errors.New("post body is missing")
	ErrPostSlugExists    = errors.New("post with specified slug already exists")
)
