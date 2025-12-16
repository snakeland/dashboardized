import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

// Mock useAuth0
const mockAuth0 = {
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn(),
    isAuthenticated: { value: true },
    isLoading: { value: false },
}

vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => mockAuth0,
}))

describe('useAuth Composable', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        mockAuth0.getAccessTokenSilently.mockResolvedValue('token')
    })

    it('login calls auth0.loginWithRedirect', async () => {
        const { login } = useAuth()
        const store = useAuthStore()

        await login()

        expect(store.isLoading).toBe(false) // Should reset loading after
        expect(mockAuth0.loginWithRedirect).toHaveBeenCalledWith(
            expect.objectContaining({
                appState: { target: '/dashboard' },
            })
        )
    })

    it('loginWithProvider calls auth0 with connection', async () => {
        const { loginWithProvider } = useAuth()

        await loginWithProvider('github')

        expect(mockAuth0.loginWithRedirect).toHaveBeenCalledWith(
            expect.objectContaining({
                authorizationParams: { connection: 'github' },
            })
        )
    })

    it('logout calls auth0.logout and store.logout', async () => {
        const { logout } = useAuth()
        const store = useAuthStore()
        vi.spyOn(store, 'logout').mockImplementation(async () => { })

        await logout()

        expect(store.logout).toHaveBeenCalled()
        expect(mockAuth0.logout).toHaveBeenCalledWith(
            expect.objectContaining({
                logoutParams: { returnTo: expect.any(String) },
            })
        )
    })

    it('getAccessToken calls auth0.getAccessTokenSilently', async () => {
        const { getAccessToken } = useAuth()

        const token = await getAccessToken()

        expect(token).toBe('token')
        expect(mockAuth0.getAccessTokenSilently).toHaveBeenCalled()
    })

    it('handles login error', async () => {
        mockAuth0.loginWithRedirect.mockRejectedValue(new Error('Auth error'))
        const { login } = useAuth()
        const store = useAuthStore()

        await login()

        expect(store.error).toBe('Auth error')
        expect(store.isLoading).toBe(false)
    })
})
