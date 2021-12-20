exports.getAllEndPoints = () => {
    return {
        'GET: /api/categories': 'Responds with an array of category objects',
        'GET: /api/reviews/:review_id': 'Responds with a review object with the defined review_id',
        'GET: /api/reviews': 'Responds with a reviews array containg all review objects; can be used with queries: sort_by, order and category. This endpoint also has pagination as a feature just use the queries limit and page',
        'GET: /api/reviews/:review_id/comments': 'Responds with an array of comments for the given review_id',
        'GET: /api': 'Where you are right now!',
        'GET: /api/users': 'Responds with an array of objects containing usernames',
        'GET: /api/users/:username': 'responds with the requested username object containing: username, avatar_url, name',
        'PATCH: /api/reviews/:review_id': 'Must send an object in the form of {inc_votes: number}, will respond with the patched review',
        'PATCH: /api/comments/:comment_id': 'Must send an object in the form of { inc_votes: 1 | -1 } depending on increment or decrement. Responds with the requested comment with votes added/subtracted',
        'POST: /api/reviews/:review_id/comments': 'Must send an object in the form of {username: string, body: string}, will respond with the new posted comment',
        'POST: /api/reviews': 'Must send an object with the following parameters: owner (username), title, review_body, designer and a valid category',
        'DELETE: /api/comments/:comment_id': 'Delete the requested comment_id, will respond with "204"'
    };
};