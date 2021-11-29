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
