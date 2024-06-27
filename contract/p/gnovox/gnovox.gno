package gnovox

import (
	"std"
	"time"

	"gno.land/p/demo/avl"
)

type User struct {
	Address           std.Address
	Username		  string
	Posts             avl.Tree // slug -> *Post
}

type Post struct {
	Slug		 string
	Title        string
	Body         string
	CreatedAt    time.Time
	Publisher    std.Address
}

func NewUser(address std.Address) User {
	return User{
		Address:  address,
		Username: address.String(),
	}
}

func (u *User) NewPost(publisher std.Address, slug, title, body, pubDate string) error {
	if _, found := u.Posts.Get(slug); found {
		return ErrPostSlugExists
	}

	if title == "" {
		return ErrPostTitleMissing
	}
	if body == "" {
		return ErrPostBodyMissing
	}
	if slug == "" {
		return ErrPostSlugMissing
	}

	var parsedTime time.Time
	var err error
	if pubDate != "" {
		parsedTime, err = time.Parse(time.RFC3339, pubDate)
		if err != nil {
			return err
		}
	} else {
		// If no publication date was passed in by caller, take current block time
		parsedTime = time.Now()
	}

	post := &Post{
		Slug:      slug,
		Title:     title,
		Body:      body,
		CreatedAt: parsedTime,
		Publisher: publisher,
	}

	u.Posts.Set(slug, post)
	return nil
}