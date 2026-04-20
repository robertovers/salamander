---
title: Sed Do Eiusmod Tempor Incididunt
date: 2024-03-10
tags:
  - ipsum
  - amet
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Project Structure

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
my-api/
├── main.go
├── handlers/
│   ├── posts.go
│   └── users.go
├── models/
│   └── post.go
└── go.mod
```

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

## Defining the Model

```go
package models

import "time"

type Post struct {
    ID        int       `json:"id"`
    Title     string    `json:"title"`
    Body      string    `json:"body"`
    AuthorID  int       `json:"author_id"`
    CreatedAt time.Time `json:"created_at"`
}
```

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione sequi nesciunt.

## Writing the Handler

At vero eos et accusamus et iusto odio dignissimos ducimus. The handler reads the `id` path parameter, fetches the record, and returns JSON:

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "my-api/models"
)

func GetPost(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.PathValue("id"))
    if err != nil {
        http.Error(w, "invalid id", http.StatusBadRequest)
        return
    }

    post, err := models.FindPost(id)
    if err != nil {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(post)
}
```

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Use `r.PathValue` (available since Go 1.22) to avoid pulling in a third-party router for simple cases.

### Registering Routes

```go
package main

import (
    "net/http"

    "my-api/handlers"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /posts/{id}", handlers.GetPost)
    http.ListenAndServe(":8080", mux)
}
```

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum dolorem eum fugiat quo voluptas nulla pariatur.
