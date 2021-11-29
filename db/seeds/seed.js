const db = require('../connection');
const pg = require('pg');
const format = require('pg-format');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  
  // DROP TABLES IF EXIST

  return db.query(`DROP TABLE IF EXISTS catergories;`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS reviews`)
  }).then(()=>{
    return db.query(`DROP TABLE IF EXISTS comments`)
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
  
};

module.exports = seed;
