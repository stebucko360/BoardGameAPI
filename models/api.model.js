exports.getAllEndPoints = () => {
    return {
        'GET: /api/categories': 'Responds with an array of category objects',
        'GET: /api/reviews/:review_id': 'Responds with a review object with the defined review_id',
        'GET: /api/reviews': 'Responds with a reviews array containg all review objects',
        'GET: /api/reviews/:review_id/comments': 'Responds with an array of comments for the given review_id',
        'GET: /api': 'Where you are right now!',
        'PATCH: /api/reviews/:review_id': 'Must send an object in the form of {inc_votes: number}, will respond with the patched review',
        'POST: /api/reviews/:review_id/comments': 'Must send an object in the form of {username: string, body: string}, will respond with the new posted comment',
        'DELETE: /api/comments/:comment_id': 'Delete the requested comment_id, will respond with "204"'
    };
};