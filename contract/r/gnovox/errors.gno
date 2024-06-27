package gnovox

import "errors"

var (
	ErrUserExist    = errors.New("user already exist")
	ErrUserNotFound = errors.New("user not found")
)
