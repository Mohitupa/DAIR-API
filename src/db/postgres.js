const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost',
})

module.exports = { pool };

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: 'xnfstsadiatxka',
//   database: 'd1o0482cjuemj4',
//   password: 'bc87f3bc4501839abbb8f27431fb4ec4c92a8f3a1a28a9dd93d3d91401419cd1',
//   port: 5432,
//   host: 'ec2-3-209-39-2.compute-1.amazonaws.com',
// })

// module.exports = { pool };