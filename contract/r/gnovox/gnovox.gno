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

func AddUser() error {
	caller := std.GetOrigCaller()

	if _, found := users.Get(caller.String()); found {
		return ErrUserExist
	}

	u := gnovox.NewUser(caller)
	users.Set(caller.String(), &u)
	return nil
}

func GetUser(username string) gnovox.User {

}

func GetUsers() string {
	jsonResponse := json.ArrayNode("", []*json.Node{})

	users.ReverseIterate("", "", func(address string, value interface{}) bool {
		u := value.(*gnovox.User)
		node := json.ObjectNode("", map[string]*json.Node{
			"address": json.StringNode("address", address),
			"username": json.StringNode("username", u.Username),
		})
		jsonResponse.AppendArray(node)
		return false
	})

	b, err := json.Marshal(jsonResponse)
	checkErr(err)

	return string(b)
}

func Render(path string) string {
	return "not implemented"
}
