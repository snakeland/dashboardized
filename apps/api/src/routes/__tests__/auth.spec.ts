import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import authRouter from '../auth'
import * as authMiddleware from '../../middleware/auth'

// Mock the auth middleware
vi.mock('../../middleware/auth', () => ({
    validateJWT: (_req: any, _res: any, next: any) => next(),
    requireAuth: (req: any, _res: any, next: any) => {
        req.auth = { payload: { sub: 'auth0|123' } }
        next()
    },
    getUserInfo: vi.fn(),
}))

const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)

describe('Auth Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default mock implementation
        vi.mocked(authMiddleware.getUserInfo).mockReturnValue({
            id: 'auth0|123',
            email: 'test@example.com',
            name: 'Test User',
            picture: 'pic.jpg',
        })
    })

    describe('GET /api/auth/me', () => {
        it('should return user info when authenticated', async () => {
            const response = await request(app).get('/api/auth/me')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                user: {
                    id: 'auth0|123',
                    email: 'test@example.com',
                    name: 'Test User',
                    picture: 'pic.jpg',
                },
            })
        })

        it('should return 401 if user info is missing', async () => {
            vi.mocked(authMiddleware.getUserInfo).mockReturnValue(null)

            const response = await request(app).get('/api/auth/me')

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                error: 'Unauthorized',
                message: 'User information not found',
            })
        })

        it('should handle optional fields', async () => {
            vi.mocked(authMiddleware.getUserInfo).mockReturnValue({
                id: 'auth0|123',
                // Missing email, name, picture
            } as any)

            const response = await request(app).get('/api/auth/me')

            expect(response.status).toBe(200)
            expect(response.body.user).toEqual({
                id: 'auth0|123',
                email: '',
                name: '',
                // picture undefined
            })
        })
    })

    describe('POST /api/auth/logout', () => {
        it('should return success message', async () => {
            const response = await request(app).post('/api/auth/logout')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                message: 'Logged out successfully',
            })
        })
    })
})
