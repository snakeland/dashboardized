import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import userRouter from '../user'
import * as authMiddleware from '../../middleware/auth'

// Mock the auth middleware
vi.mock('../../middleware/auth', () => ({
    validateJWT: (_req: any, _res: any, next: any) => next(),
    requireAuth: (req: any, _res: any, next: any) => {
        req.auth = { payload: { sub: 'auth0|123' } }
        next()
    },
    getUserId: vi.fn(),
}))

const app = express()
app.use(express.json())
app.use('/api/user', userRouter)

describe('User Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default mock implementation for getUserId
        vi.mocked(authMiddleware.getUserId).mockReturnValue('auth0|123')
    })

    describe('GET /api/user/profile', () => {
        it('should return user profile when authenticated', async () => {
            const response = await request(app).get('/api/user/profile')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                userId: 'auth0|123',
                message: 'Profile endpoint - database integration pending',
            })
        })

        it('should return 401 if user ID is missing', async () => {
            vi.mocked(authMiddleware.getUserId).mockReturnValue(null)

            const response = await request(app).get('/api/user/profile')

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                error: 'Unauthorized',
                message: 'User ID not found',
            })
        })
    })

    describe('GET /api/user/dashboard', () => {
        it('should return default dashboard preferences', async () => {
            const response = await request(app).get('/api/user/dashboard')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                userId: 'auth0|123',
                widgets: ['weather'],
                layout: null,
                theme: 'auto',
            })
        })

        it('should return 401 if user ID is missing', async () => {
            vi.mocked(authMiddleware.getUserId).mockReturnValue(null)

            const response = await request(app).get('/api/user/dashboard')

            expect(response.status).toBe(401)
        })
    })

    describe('PUT /api/user/dashboard', () => {
        it('should update dashboard preferences', async () => {
            const newPreferences = {
                widgets: ['weather', 'clock'],
                layout: { type: 'grid' },
                theme: 'dark',
            }

            const response = await request(app)
                .put('/api/user/dashboard')
                .send(newPreferences)

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Dashboard preferences updated')
            expect(response.body.preferences).toMatchObject({
                userId: 'auth0|123',
                widgets: ['weather', 'clock'],
                layout: { type: 'grid' },
                theme: 'dark',
            })
        })

        it('should return 401 if user ID is missing', async () => {
            vi.mocked(authMiddleware.getUserId).mockReturnValue(null)

            const response = await request(app)
                .put('/api/user/dashboard')
                .send({})

            expect(response.status).toBe(401)
        })
    })
})
