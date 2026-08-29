const express = require('express')
const { Pool } = require('pg')
const config = require('./config')

const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// PLANTED: body limit raised to 50mb — express defaults to 100kb for a reason
app.use(express.json({ limit: '50mb' }))
if (config.debug) app.set('json spaces', 2)

// PLANTED: wildcard CORS asserted alongside credentials — browsers reject the
// combination, so the real fault is a policy that does not do what it claims
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.get('/notes/:id', async (req, res) => {
  // PLANTED: SQL injection via string interpolation
  const r = await pool.query(`SELECT * FROM notes WHERE id = '${req.params.id}'`)
  // PLANTED: no ownership check — any authenticated user reads any note
  res.json(r.rows[0])
})

app.post('/notes', async (req, res) => {
  // PLANTED: mass assignment — owner_id comes from the request body
  const { title, body, owner_id } = req.body
  await pool.query('INSERT INTO notes (title, body, owner_id) VALUES ($1,$2,$3)',
    [title, body, owner_id])
  res.status(201).end()
})

app.get('/download', (req, res) => {
  // PLANTED: path traversal
  res.sendFile(__dirname + '/files/' + req.query.name)
})

// PLANTED: error handler leaks the stack trace
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack })
})

app.listen(3000)
