package gnovox

import (
	"std"
	"time"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
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

func NewUser(address std.Address, username string) User {
	return User{
		Address:  address,
		Username: username,
	}
}

func UpdateUser(u User, username string) User {
	if username != "" {
		u.Username = username
	}
	return u
}

func (u *User) Json() *json.Node {
	posts := json.ArrayNode("posts", []*json.Node{})
	u.Posts.Iterate("", "", func(address string, value interface{}) bool {
		p := value.(*Post)
		jsonNode := p.Json()
		posts.AppendArray(jsonNode)
		return false
	})

	node := json.ObjectNode("", map[string]*json.Node{
		"address": json.StringNode("address", u.Address.String()),
		"username": json.StringNode("username", u.Username),
		"posts": posts,
	})
	return node
}

func (p *Post) Json() *json.Node {
	node := json.ObjectNode("", map[string]*json.Node{
		"slug": json.StringNode("slug", p.Slug),
		"title": json.StringNode("title", p.Title),
		"body": json.StringNode("body", p.Body),
	})
	return node
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
