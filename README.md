# Stephen Buckley's Board Game Review API

## Link to hosted version:

https://stephen-board-game-api.herokuapp.com/api

## List of endpoints:

### GET:

/api = This will bring you to the main api route that will display a full list of potential endpoints available.

/api/categories = Responds with an array of category objects.

/api/reviews/:review_id = Responds with a review object specified by the :review_id provided.

/api/reviews = Responds with a reviews array, containing all review objects.

There are various queries available for this end point:
- sort_by = 'title', 'owner', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'count'.
- order = asc or desc.
- category = Specify a boardgame category and have these results returned only.

(All of the above queries have been coded to prevent SQL injection attacks)

/api/reviews/:review_id/comments = Responds with an array of comments for the provided review_id.

### PATCH:

/api/reviews/:review_id = Send an object in the form of {inc_votes: number}. This can both increment and decrement the value. This end point will respond with the patched review.

Any invalid key/value properties will be dealt with by the error handler and return the error.

### POST:

/api/reviews/:review_id/comments = Must send an object in the form of {username: 'string', body: 'string'}, will respond with the new comment object. 

Any invalid key/value properties will be dealt with by the error handler and return the error.

### DELETE:

/api/comments/:comment_id: Delete the requested comment with the corresponding comment_id. Will respond with '204'.
