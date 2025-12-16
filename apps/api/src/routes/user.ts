import { Router, Request, Response, type IRouter } from 'express'
import { validateJWT, requireAuth, getUserId } from '../middleware/auth'

const router: IRouter = Router()

// In-memory storage for user preferences (temporary - should use database)
const userPreferences = new Map<string, unknown>()

/**
 * GET /api/user/profile
 * Get the current user's profile
 */
router.get(
  '/profile',
  validateJWT,
  requireAuth,
  (req: Request, res: Response) => {
    const userId = getUserId(req)

    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found',
      })
      return
    }

    // TODO: Fetch from database
    res.json({
      userId,
      message: 'Profile endpoint - database integration pending',
    })
  }
)

/**
 * GET /api/user/dashboard
 * Get the current user's dashboard configuration
 */
router.get(
  '/dashboard',
  validateJWT,
  requireAuth,
  (req: Request, res: Response) => {
    const userId = getUserId(req)

    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found',
      })
      return
    }

    const preferences = userPreferences.get(userId) || {
      userId,
      widgets: ['weather'], // Default widget
      layout: null,
      theme: 'auto',
    }

    res.json(preferences)
  }
)

/**
 * PUT /api/user/dashboard
 * Update the current user's dashboard configuration
 */
router.put(
  '/dashboard',
  validateJWT,
  requireAuth,
  (req: Request, res: Response) => {
    const userId = getUserId(req)

    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found',
      })
      return
    }

    const { widgets, layout, theme } = req.body

    const preferences = {
      userId,
      widgets: widgets || ['weather'],
      layout: layout || null,
      theme: theme || 'auto',
      updatedAt: new Date(),
    }

    // Store in memory (TODO: persist to database)
    userPreferences.set(userId, preferences)

    res.json({
      message: 'Dashboard preferences updated',
      preferences,
    })
  }
)

export default router
