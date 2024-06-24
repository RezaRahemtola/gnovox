package gnovox

import (
	"std"
	"time"

	"gno.land/p/demo/avl"
)

type Blog struct {
	Title             string
	Posts             avl.Tree // slug -> *Post
}

type Post struct {
	Title        string
	Body         string
	CreatedAt    time.Time
	Publisher    std.Address
}

func NewBlog(title string) Blog {
	return Blog{
		Title: title,
	}
}

func (b *Blog) NewPost(publisher std.Address, slug, title, body, pubDate string) error {
	if _, found := b.Posts.Get(slug); found {
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
		Title:     title,
		Body:      body,
		CreatedAt: parsedTime,
		Publisher: publisher,
	}

	b.Posts.Set(slug, post)
	return nil
}
