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
                        owner: 'bainesface',
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
        test('400: if passed an invalid review_id return "Bad request"', ()=>{

            return request(app)
            .get('/api/reviews/404')
            .expect(400)
            .then((result)=>{
                expect(result.body).toEqual({msg: 'Invalid review_id'})
            })
        })
    })
});

describe('PATCH /api/reviews/review_id', ()=>{
    test('201: successfully patch the requested user_id with the requested amount of votes', ()=>{

        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: 1})
        .expect(201)
        .then((result)=>{
            expect(result.body.review.votes).toBe(6);
        })
    });
    test('201: successfully patch the requested user_id with the requested amount of votes', ()=>{

        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: -1})
        .expect(201)
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
                expect(result.body).toEqual({msg: 'Invalid vote value'})
            })
        })
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

    test('200: responds with array of objects sorted by title', ()=>{

        return request(app)
        .get('/api/reviews?sort_by=title')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeSortedBy('title');
        });
    });

    test('200: responds with array of objects sorted by category', ()=>{

        return request(app)
        .get('/api/reviews?sort_by=category')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews).toBeSortedBy('category');
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

    test('200: responds with array of objects where category = social deduction', ()=>{

        return request(app)
        .get('/api/reviews?category=social deduction')
        .expect(200)
        .then((result)=>{
            expect(result.body.reviews.length).toBe(13)
    });
});

    describe('ERROR handling', ()=>{
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
