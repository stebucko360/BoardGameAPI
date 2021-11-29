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
    return db.query(`DROP TABLE IF EXISTS categories;`)
  })
  .then(()=>{
  //CREATE TABLES

  return db.query(`
  CREATE TABLE categories(
    slug VARCHAR(100) PRIMARY KEY NOT NULL,
    description VARCHAR(200)
  );`)
  })
  .then(()=>{

    return db.query(`
    CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY NOT NULL,
      avatar_url VARCHAR(500),
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
      category VARCHAR(100) REFERENCES categories (slug),
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
  .then(()=>{
    const queryString = format(`
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    %L;`, userData.map((item)=>[item.username, item.name, item.avatar_url]));

    return db.query(queryString);
  })
  .then(()=>{
    const queryString = format(`
    INSERT INTO categories
    (slug, description)
    VALUES
    %L;`, categoryData.map((item)=>[item.slug, item.description]));
    
    return db.query(queryString);
  })
  .then(()=>{
    const queryString = format(`
    INSERT INTO reviews
    (title, designer, owner, review_img_url, review_body, category, created_at, votes)
    VALUES
    %L;`, reviewData.map((item)=>[item.title, item.designer, item.owner, item.review_img_url, item.review_body, item.category, item.created_at, item.votes]));
    
    return db.query(queryString);
  })
  .then(()=>{
    const queryString = format(`
    INSERT INTO comments
    (body, votes, author, review_id, created_at)
    VALUES
    %L;`, commentData.map((item)=>[item.body, item.votes, item.author, item.review_id, item.created_at]));

    return db.query(queryString);
  })

};

module.exports = seed;
