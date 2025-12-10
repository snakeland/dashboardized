import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dashboardized-api' })
})

// API routes will be added here
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Dashboardized API is running!' })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})

export default app
