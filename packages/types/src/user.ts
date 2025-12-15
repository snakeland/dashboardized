/**
 * User type definitions for authentication and user management
 */

export interface User {
  /** Unique user identifier */
  id: string
  /** User's email address */
  email: string
  /** User's display name */
  name: string
  /** User's profile picture URL */
  picture?: string
  /** OAuth provider used for authentication */
  provider: 'google' | 'github' | 'auth0'
  /** Account creation timestamp */
  createdAt: Date
  /** Last update timestamp */
  updatedAt: Date
}

export interface AuthTokens {
  /** JWT access token */
  accessToken: string
  /** Optional refresh token for token renewal */
  refreshToken?: string
  /** Token expiration time in seconds */
  expiresIn: number
  /** Token type (typically 'Bearer') */
  tokenType?: string
}

export interface AuthSession {
  /** Authenticated user information */
  user: User
  /** Authentication tokens */
  tokens: AuthTokens
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean
}

export interface LoginCredentials {
  /** Email address */
  email: string
  /** Password */
  password: string
}

export interface AuthError {
  /** Error code */
  code: string
  /** Human-readable error message */
  message: string
  /** Additional error details */
  details?: unknown
}

export interface UserProfile {
  /** User's email address */
  email: string
  /** User's display name */
  name: string
  /** User's profile picture URL */
  picture?: string
  /** Whether email is verified */
  emailVerified?: boolean
}

export interface DashboardPreferences {
  /** User ID */
  userId: string
  /** Selected widget IDs */
  widgets: string[]
  /** Dashboard layout configuration */
  layout?: unknown
  /** Theme preference */
  theme?: 'light' | 'dark' | 'auto'
  /** Last updated timestamp */
  updatedAt: Date
}
