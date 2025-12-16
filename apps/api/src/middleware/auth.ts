import { Request, Response, NextFunction } from 'express'
import { auth } from 'express-oauth2-jwt-bearer'

/**
 * JWT validation middleware using Auth0
 * Validates the JWT token from the Authorization header
 */
export const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
})

/**
 * Extended Express Request interface with authenticated user info
 * Uses type assertion instead of extending to avoid conflicts
 */
export type AuthenticatedRequest = Request & {
  auth?: {
    payload: Record<string, unknown> & {
      sub: string
      email?: string
      name?: string
      picture?: string
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * Use this after validateJWT to ensure auth payload exists
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest

  if (!authReq.auth?.payload) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    })
    return
  }

  next()
}

/**
 * Extract user ID from authenticated request
 */
export const getUserId = (req: Request): string | null => {
  const authReq = req as AuthenticatedRequest
  return authReq.auth?.payload?.sub || null
}

/**
 * Extract user info from authenticated request
 */
export const getUserInfo = (req: Request) => {
  const authReq = req as AuthenticatedRequest
  if (!authReq.auth?.payload) {
    return null
  }

  return {
    id: authReq.auth.payload.sub,
    email: authReq.auth.payload.email,
    name: authReq.auth.payload.name,
    picture: authReq.auth.payload.picture,
  }
}
