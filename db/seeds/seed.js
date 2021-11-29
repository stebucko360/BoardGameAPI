const db = require('../connection');
const pg = require('pg');
const format = require('pg-format');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  
  // DROP TABLES IF EXIST

  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS reviews;`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users;`)
  }).then(()=>{
    return db.query(`DROP TABLE IF EXISTS catergories;`)
  })
  .then(()=>{
  //CREATE TABLES

  return db.query(`
  CREATE TABLE catergories(
    slug VARCHAR(100) PRIMARY KEY NOT NULL,
    description VARCHAR(200)
  );`)
  })
  .then(()=>{

    return db.query(`
    CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY NOT NULL,
      avatar_url VARCHAR(250),
      name VARCHAR(100) NOT NULL
    );`)
  })
  .then(()=>{

    return db.query(`
    CREATE TABLE reviews(
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR(100) NOT NULL,
      review_img_url VARCHAR(400) DEFAULT E'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      catergory VARCHAR(100) REFERENCES catergories (slug),
      owner VARCHAR(100) REFERENCES users (username),
      created_at DATE DEFAULT CURRENT_TIMESTAMP
    );`)
  })
  .then(()=>{
    return db.query(`
  CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(100) REFERENCES users (username),
    review_id INT REFERENCES reviews (review_id),
    votes INT DEFAULT 0,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL
  );`)
  })
  
};

module.exports = seed;
