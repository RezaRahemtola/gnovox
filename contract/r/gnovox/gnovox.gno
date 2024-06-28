package gnovox

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/gnovox"
)

var (
	users      avl.Tree // address -> *User
)

func AddUser(username string) {
	caller := std.GetOrigCaller()

	if _, found := users.Get(caller.String()); found {
		// TODO: also check username
		panic(ErrUserExist)
	}

	u := gnovox.NewUser(caller, username)
	users.Set(caller.String(), &u)
}

func UpdateUser(username string) {
	caller := std.GetOrigCaller()

	// TODO: check that username isn't already taken
	value, found := users.Get(caller.String());
	if found == false {
		panic(ErrUserNotFound)
	}
	currentUser := value.(*gnovox.User)
	u := gnovox.UpdateUser(*currentUser, username)
	users.Set(caller.String(), &u)
}

func GetUserByAddress(address std.Address) string {
	value, found := users.Get(address.String());

	if found == false {
		panic(ErrUserNotFound)
	}
	u := value.(*gnovox.User)
	jsonResponse := u.Json()

	b, err := json.Marshal(jsonResponse)
	checkErr(err)

	return string(b)
}

func NewPost(slug, title, body string) {
	caller := std.GetOrigCaller()

	value, found := users.Get(caller.String());
	if found == false {
		panic(ErrUserNotFound)
	}
	u := value.(*gnovox.User)
	err := u.NewPost(caller, slug, title, body, "") // TODO: Ask pubDate to users
	checkErr(err)
}

func GetUsers() string {
	jsonResponse := json.ArrayNode("", []*json.Node{})

	users.Iterate("", "", func(address string, value interface{}) bool {
		u := value.(*gnovox.User)
		jsonNode := u.Json()
		jsonResponse.AppendArray(jsonNode)
		return false
	})

	b, err := json.Marshal(jsonResponse)
	checkErr(err)

	return string(b)
}

func Render(path string) string {
	return "not implemented"
}
