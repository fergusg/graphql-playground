# GraphQL

1. Ensure `server.js` points to `schema.final`
1. Possibly uncomment `Conn.sync` lines in `db.js`
1. `$ npm start`
1. `http://localhost:3000/graphql`

## Intro

GraphQL is an interface specification, open-sourced by FaceBook to map requests to data.
I like to think of it as REST on steroids.

It is a specification with server implementations for all the usual suspects.

One point I'd like to emphasize early on - GraphQL is *completely neutral*
with respect to the datasources.  e.g., it could be SQL or an existing REST API.
A JSON file or a callout to an external service.

What I think is really cool is the way it allow the client to have massive flexibility
over the data returned -

1. The data is in the same "shape" as the request.
1. No more data is returned than needed.

Let's consider a simple blog model.  We have

1. `People` with `firstName` `lastName`, `email`
1. `Posts` with `title` and `content` (possibly quite long)
1. Each person can write one or more posts.

We'll assume there are manageble number of posts for now, which can be viewed on
a single page.

Suppose we want a webpage with a list of posts, the author and
"other posts by this author" links

So maybe we have an APU like:

1. `/posts` returning `title`, `content`, `person_id`
1. `/person/n` returning author details
1. `/person/n/posts` returning posts  by that author (`id`, `title`, say)

This is obviously a bit inefficient in terms of the number of requests,
let along the complexity of managing lost of async requests client-side.

Now in this simplistic example one might have a "single shot" endpoint
returning everything but that's probably not going to scale for a more
realistic model.  But lets go with that for now.  Let's call that `/allposts`

Now suppose you also want a mobile version.  On a mobile you might not want
*all* the data on an initial request.  Perhaps one might want to
skip the `content` for a sub-page.

What might one do?

One might have `/all_posts_without_content` or `/all_posts?skip=content`

Clearly that's not gonna scale either.

Say hello to `graphql`

## Demo

This is a `graphql`-explorer that comes with FaceBook's client implementation.
One of the nice features of graphql is the it's self-describing, so that
the server can supply a schema back to the client so we can get autocompletion
and validation.

`graphql` syntax might loosely be describes as "JSON without the values"

Suppose I want all posts
```
{
    posts
}
```

One must always ask for something back


```
{
     posts {
        title
        content
     }
}
```

Then we want the author

```
    person {
        firstName
        lastName
    }
```

Didn't we also want the authors other posts?

```
    posts {
    id
    }
```

Hey, what about that mobile version without the `content`? **DELETE**

Perhaps we don't want the authors posts either? **DELETE**

Now perhaps we want something different.  A list of all authors with links
to their posts.

```
{
  people {
    firstName
    lastName
    posts {
      id
      title
    }
  }
}
```

Suppose I only want a specific user

```
   people(id: 1) {...}
```

Or perhaps by email

```
  people(email: "%gmail.com") {...}
```

Or only the first 2 authors

```
    people(limit: 2) {...}
```

Or the first 2 authors at yahoo.

```
    people(limit: 2, email: "%yahoo") {...}
```

As we'll see in a minute, `graphql` doesn't have *any* in-built filters.  It's my
code that interprets those parameters as

```
    select * from table where email like '%yahoo.com'
```

As I said above, `graphql` is completely datasource agnostic.

Now we'll build this from the the ground up.   We'll not really
as we've got limited time and I'm the world's worst live coder.  But
I hope to give you a taste of how easy it is to build a rich
query interface with relatively little effort.

## Coding

*(change server.js to point to schema.0)*
