import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { requireAuth, getUserId, getUserInfo } from '../auth'

vi.mock('express-oauth2-jwt-bearer', () => ({
    auth: vi.fn().mockReturnValue((_req: any, _res: any, next: any) => next()),
}))

describe('Auth Middleware', () => {
    let req: any
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        req = {}
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }
        next = vi.fn() as unknown as NextFunction
    })

    describe('requireAuth', () => {
        it('should call next() if user is authenticated', () => {
            req.auth = {
                payload: {
                    sub: 'auth0|123',
                    iss: 'https://issuer.com/',
                    aud: 'audience',
                    iat: 123456,
                    exp: 123456,
                },
            }

            requireAuth(req as Request, res as Response, next)

            expect(next).toHaveBeenCalled()
            expect(res.status).not.toHaveBeenCalled()
        })

        it('should return 401 if user is not authenticated', () => {
            req.auth = undefined

            requireAuth(req as Request, res as Response, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Authentication required',
            })
        })

        it('should return 401 if auth payload is missing', () => {
            req.auth = {} as any

            requireAuth(req as Request, res as Response, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })
    })

    describe('getUserId', () => {
        it('should return user ID from auth payload', () => {
            req.auth = {
                payload: {
                    sub: 'auth0|123',
                } as any,
            }

            const userId = getUserId(req as Request)
            expect(userId).toBe('auth0|123')
        })

        it('should return null if auth payload is missing', () => {
            req.auth = undefined
            expect(getUserId(req as Request)).toBeNull()
        })
    })

    describe('getUserInfo', () => {
        it('should return user info from auth payload', () => {
            req.auth = {
                payload: {
                    sub: 'auth0|123',
                    email: 'test@example.com',
                    name: 'Test User',
                    picture: 'https://example.com/pic.jpg',
                } as any,
            }

            const userInfo = getUserInfo(req as Request)
            expect(userInfo).toEqual({
                id: 'auth0|123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
            })
        })

        it('should return null if auth payload is missing', () => {
            req.auth = undefined
            expect(getUserInfo(req as Request)).toBeNull()
        })
    })
})
