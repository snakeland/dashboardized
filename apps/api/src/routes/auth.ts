import { Router, Request, Response, type IRouter } from 'express'
import { validateJWT, requireAuth, getUserInfo } from '../middleware/auth'

const router: IRouter = Router()

/**
 * GET /api/auth/me
 * Get the currently authenticated user's information
 * Requires valid JWT token
 */
router.get('/me', validateJWT, requireAuth, (req: Request, res: Response) => {
  const userInfo = getUserInfo(req)

  if (!userInfo) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'User information not found',
    })
    return
  }

  res.json({
    user: {
      id: userInfo.id,
      email: userInfo.email || '',
      name: userInfo.name || '',
      picture: userInfo.picture,
    },
  })
})

/**
 * POST /api/auth/logout
 * Logout endpoint (client-side should clear tokens)
 */
router.post('/logout', (_req: Request, res: Response) => {
  // With Auth0, logout is primarily client-side
  // This endpoint can be used for additional cleanup if needed
  res.json({
    message: 'Logged out successfully',
  })
})

export default router
