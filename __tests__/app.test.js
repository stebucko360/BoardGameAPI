const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', ()=>{
    test('200: should return an array of categories', ()=>{
        
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((result)=>{
            
            expect(result.body.categories.length > 0).toBe(true);
            expect(result.body.categories).toBeInstanceOf(Array);
            result.body.categories.forEach((object)=>{
                expect(object).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                )
            })
        })
    });

    test('200: should respond with a review object with the correct properties', ()=>{

        return request(app)
        .get('/api/reviews/3')
        .expect(200)
        .then((result)=>{
            expect(result.body.review).toBeInstanceOf(Object);
            expect(result.body.review.comment_count).toBe('3');
            expect(result.body.review).toEqual(
                  {
                        username: 'bainesface',
                        title: 'Ultimate Werewolf',
                        review_id: 3,
                        review_body: "We couldn't find the werewolf!",
                        designer: 'Akihisa Okui',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        category: 'social deduction',
                        created_at: expect.any(String),
                        votes: 5,
                        comment_count: "3"
                    })
                
            })
    })

    describe('ERROR handling', ()=>{
        test('404: if passed a review_id that does not exist return "review_id does not exist"', ()=>{
            return request(app)
            .get('/api/reviews/404')
            .expect(404)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'review_id does not exist'})
            })
        });
        test('400: if passed an invalid review_id return "Invalid review_id"', ()=>{
            
            return request(app)
            .get('/api/reviews/apple')
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid value'})
            })
        });
    });
    
});

describe('PATCH /api/reviews/review_id', ()=>{
    test('200: successfully patch the requested user_id with the requested amount of votes', ()=>{

        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: 1})
        .expect(200)
        .then((result)=>{
            expect(result.body.review.votes).toBe(6);
        })
    });
    test('200: successfully patch the requested user_id with the requested amount of votes', ()=>{

        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: -1})
        .expect(200)
        .then((result)=>{
            expect(result.body.review.votes).toBe(4);
        })
    });
    describe('ERROR handling', ()=>{
        test('400: if not passed the correct key/value return bad request', ()=>{
            
            return request(app)
            .patch('/api/reviews/3')
            .send({wrongKey: 1})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid vote key'})
            })
        });
        test('400: if not passed the correct key/value return bad request', ()=>{

            return request(app)
            .patch('/api/reviews/3')
            .send({inc_votes: 'apple'})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid value'})
            })
        });
        test('404: if not passed a non existant review_id return', ()=>{

            return request(app)
            .patch('/api/reviews/404')
            .send({inc_votes: '1'})
            .expect(404)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'review_id does not exist'})
            })
        });
    });
    
});

describe('GET /api/reviews', ()=>{
    test('200: responds with a reviews array with the correct properties', ()=>{

        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeInstanceOf(Array);
            result.body.reviews.forEach((object)=>{
                expect(object).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    });

    // only fails on ubuntu - passes on macOS - Due to ordering reqs on toBeSortedBy
    // test('200: responds with array of objects sorted by title', ()=>{

    //     return request(app)
    //     .get('/api/reviews?sort_by=title')
    //     .expect(200)
    //     .then((result)=>{
    //         expect(result.body.reviews).toBeSortedBy('title', { descending: true});
    //     });
    // });
    test('200: when not passed a sort_by or order query, resolve to defaults', ()=>{

        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeSortedBy('created_at', { descending: true});
        });
    })

    test('200: responds with array of objects sorted by category', ()=>{

        return request(app)
        .get('/api/reviews?sort_by=category')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeSortedBy('category', { descending: true});
        });
    });

    test('200: responds with array of objects sorted by category descending', ()=>{

        return request(app)
        .get('/api/reviews?sort_by=category&order=desc')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeSortedBy('category', {descending: true});
        });
    });

    test('200: responds with array of objects where category = dexterity', ()=>{

        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews.length).toBe(1)
            result.body.reviews.forEach((object)=>{
                expect(object).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: 'dexterity',
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
    });
});

    test('200: responds with an empty array if a category does exist, but no reviews have this category', ()=>{
        
        return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews.length).toBe(0);
        });
    });

    test('200: responds with an array of reviews, limited to 3 per page', ()=>{
        
        return request(app)
        .get("/api/reviews?page=1&limit=3")
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews.length).toBe(3);
            expect(result.body.reviews[0]).toEqual({
                owner: 'mallionaire',
                title: 'Mollit elit qui incididunt veniam occaecat cupidatat',
                review_id: 7,
                category: 'social deduction',
                review_img_url: 'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                created_at: expect.any(String),
                votes: 9,
                comment_count: '0'
              })
        });
    });

    describe('ERROR handling', ()=>{

        test('404 if passed a non existant category, respond "category doesnt exist"', ()=>{
            return request(app)
            .get("/api/reviews?category=thisisntreal")
            .expect(404)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'category doesnt exist'})
            });
        });

        test('400: if passed an invalid sort query, return "Invalid sort query"', ()=>{

            return request(app)
        .get('/api/reviews?sort_by=SQLINJ')
        .expect(400)
        .then((result)=>{
            expect(result.body).toEqual({msg: 'Invalid sort query'});
        });
        });

        test('400: if passed an invalid order query, return "Invalid order query"', ()=>{

            return request(app)
        .get('/api/reviews?order=SQLINJ')
        .expect(400)
        .then((result)=>{
            expect(result.body).toEqual({msg: 'Invalid order query'});
        });
        });
    })
});

describe('GET api/reviews/:review_id/comments', ()=>{
    test('200: responds with an array of comments for the given review_id', ()=>{
        
        return request(app)
        .get('/api/reviews/3/comments')
        .expect(200)
        .then((result)=>{
            expect(result.body.comments.length).toBe(3);
            expect(result.body.comments).toBeInstanceOf(Array);
            result.body.comments.forEach((object)=>{
                expect(object).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String)
                    })
                )
            })

        })
    });

    test('200: is passed a valid review_id but has no associated comments, return an empty array', ()=>{

        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then((result)=>{
            expect(result.body.comments.length).toBe(0);
        
        })

    })
    describe('ERROR handling', ()=>{
        test('404: if passed a review_id that doesnt exist, return review_id does not exist', ()=>{
            return request(app)
            .get('/api/reviews/404/comments')
            .expect(404)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'review_id does not exist'})
            })
        });
        test('400: if passed a review_id that is invalid, return "Invalid value"', ()=>{
            return request(app)
            .get('/api/reviews/banana/comments')
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid value'})
            })
        });
    });
});

describe('POST /api/reviews/:review_id/comments', ()=>{
    test('201: If passed a username and comment, post to table and return posted comment', ()=>{

        return request(app)
        .post('/api/reviews/12/comments')
        .send({username: 'dav3rid', body: 'Big setup but great game, especially with the expansions'})
        .expect(201)
        .then((result)=>{
            expect(result.body.review).toBeInstanceOf(Object);
            expect(result.body.review).toEqual(expect.objectContaining(
                {"author": "dav3rid", 
                "body": "Big setup but great game, especially with the expansions", 
                "comment_id": 7, 
                "created_at": expect.any(String), 
                "review_id": 12, 
                "votes": 0} 
            ))

        })
    });

    describe('ERROR handling', ()=>{
        test('400: if passed invalid keys, return "Bad request"', ()=>{
            
            return request(app)
            .post('/api/reviews/12/comments')
            .send({invalid: 'apple', keys: 'banana'})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: "Bad Request"})
            });
        });
    
    test('400: if passed invalid data types, return "Invalid value(s)"', ()=>{

        return request(app)
        .post('/api/reviews/12/comments')
        .send({username: 123, body: true})
        .expect(400)
        .then((result)=>{
            expect(result.body).toEqual({msg: 'Invalid value(s)'})
        })
        
    });

    test('404: if passed a review_id that doesnt exist, return "Invalid value(s)"', ()=>{

        return request(app)
        .post('/api/reviews/404/comments')
        .send({username: 'dav3rid', body: 'Big setup but great game, especially with the expansions'})
        .expect(404)
        .then((result)=>{
            expect(result.body).toEqual({msg: "review_id does not exist"})
        })
    });
});
});

describe('DELETE /api/comments/:comment_id', ()=>{
    test('204: Should delete requested comment by ID and return no content', ()=>{

        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((result)=>{
            expect(result.body).toEqual({})
            return db.query('SELECT * FROM comments;').then((result)=>{
                expect(result.rowCount).toBe(5);
            })
        })
    });
    describe('ERROR handling', ()=>{
        test('400: if comment doesnt exist return "Comment does not exist"', ()=>{

            return request(app)
            .delete('/api/comments/123')
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: "Comment does not exist"})
            })

        })
    });
});

describe('GET /api', ()=>{
    test('200: should return a JSON object contating all availabe end points', ()=>{

        const endPoints = {
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

        return request(app)
        .get('/api')
        .expect(200)
        .then((result)=>{
            expect(result.body).toEqual({endPoints: endPoints})
        })
    });
});

describe('GET /api/users', ()=>{
    test('200: Responds with an array of objects, each object should have the username property', ()=>{

        return request(app)
        .get('/api/users')
        .expect(200)
        .then((result)=>{

            expect(result.body.users.length > 0).toBe(true);
            expect(result.body.users.length).toBe(4);
            result.body.users.forEach((user)=>{
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String)
                    })
                )
            })
        });
    });
});

describe('GET /api/users/:username', ()=>{
    test('200: Responds with a user object with the defined properties', ()=>{

        return request(app)
        .get(`/api/users/mallionaire`)
        .expect(200)
        .then((result)=>{
        
            expect(result.body.user).toEqual(expect.objectContaining(
                {
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url:
                      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                  }
            ))
        });
    });
    describe('ERROR handling', ()=>{
        test('404: if passed a non existing username reponds with username does not exist', ()=>{
            
            return request(app)
            .get(`/api/users/notAUsername`)
            .expect(404)
            .then((result)=>{

                expect(result.body).toEqual({msg: 'username does not exist'})
            });
        });
    });
});

describe('PATCH /api/comments/:comment_id', ()=>{
    test('200: increments the comments vote by 1; responds with the updated comments', ()=>{

        return request(app)
        .patch('/api/comments/1')
        .send({inc_votes : 1})
        .expect(200)
        .then((result)=>{
            expect(result.body.comment).toEqual(expect.objectContaining({
                comment_id: 1,
                author: 'bainesface',
                review_id: 2,
                votes: 17,
                created_at: expect.any(String),
                body: expect.any(String)
            }))
        });
    });

    test('200: decrements the comments vote by 1; responds with the updated comments', ()=>{

        return request(app)
        .patch('/api/comments/1')
        .send({inc_votes : -1})
        .expect(200)
        .then((result)=>{
            expect(result.body.comment).toEqual(expect.objectContaining({
                comment_id: 1,
                author: 'bainesface',
                review_id: 2,
                votes: 15,
                created_at: expect.any(String),
                body: expect.any(String)
            }))
        });
    });

    describe('ERROR handling', ()=>{
        test('400: if passed an invalid comment_id, respond with Invalid value', ()=>{
            return request(app)
            .patch('/api/comments/banana')
            .send({inc_votes : -1})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid value'})
        });
        });
    

        test('400: if inc_votes value is invalid responds with Invalid value', ()=>{
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes : true})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid key/value'})
            });
        });

        test('400: if passed an invalid key, responds with Invalid value', ()=>{
            return request(app)
            .patch('/api/comments/1')
            .send({vote : 1})
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid key/value'})
            });
        });
    });
    
});
describe('POST /api/reviews', ()=>{
    test('201: If passed owner (username), title, review_body, designer and a category, post to the table and respond with new object', ()=>{

        return request(app)
        .post('/api/reviews')
        .send({owner: 'mallionaire', title: 'BloodRage', review_body: 'Fun game thats easy to pickup and setup', designer: 'Eric Lang', category: 'euro game'})
        .expect(201)
        .then((result)=>{
            expect(result.body.review).toEqual(expect.objectContaining({
                username: 'mallionaire',
                title: 'BloodRage',
                review_body: 'Fun game thats easy to pickup and setup',
                designer: 'Eric Lang',
                category: 'euro game',
                review_img_url: expect.any(String),
                review_id: 14,
                votes: 0,
                created_at: expect.any(String),
                comment_count: "0"
            }))
        })
    })
})
