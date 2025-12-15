import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dashboardized-api' })
})

// API routes
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Dashboardized API is running!' })
})

// Auth routes
app.use('/api/auth', authRoutes)

// User routes (protected)
app.use('/api/user', userRoutes)

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})

export default app
