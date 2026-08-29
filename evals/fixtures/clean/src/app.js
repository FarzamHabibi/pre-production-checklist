const express = require('express')
const { Pool } = require('pg')

const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(express.json({ limit: '100kb' }))

const ALLOWED = new Set(['https://app.example.com'])
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
  }
  next()
})

app.get('/notes/:id', async (req, res) => {
  const r = await pool.query(
    'SELECT * FROM notes WHERE id = $1 AND owner_id = $2',
    [req.params.id, req.user.id]
  )
  if (!r.rows[0]) return res.status(404).end()
  res.json(r.rows[0])
})

app.post('/notes', async (req, res) => {
  const { title, body } = req.body
  await pool.query('INSERT INTO notes (title, body, owner_id) VALUES ($1,$2,$3)',
    [title, body, req.user.id])
  res.status(201).end()
})

const path = require('path')
const FILES = path.join(__dirname, 'files')
app.get('/download', (req, res) => {
  const target = path.resolve(FILES, path.basename(String(req.query.name || '')))
  if (!target.startsWith(FILES + path.sep)) return res.status(400).end()
  res.sendFile(target)
})

app.use((err, req, res, next) => {
  req.log?.error(err)
  res.status(500).json({ error: 'internal error' })
})

app.listen(3000)
