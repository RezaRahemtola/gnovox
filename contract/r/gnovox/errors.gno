package gnovox

import "errors"

var (
	ErrUserExist    = errors.New("user already exist")
	ErrUserNotFound = errors.New("user not found")
	ErrPostNotFound = errors.New("post not found")
)
