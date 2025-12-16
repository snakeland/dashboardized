import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('Auth Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // Reset global fetch mock
        global.fetch = vi.fn()
    })

    const mockUser: any = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    it('initializes with default state', () => {
        const store = useAuthStore()
        expect(store.user).toBeNull()
        expect(store.isAuthenticated).toBe(false)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
    })

    it('sets user correctly', () => {
        const store = useAuthStore()

        store.setUser(mockUser)

        expect(store.user).toEqual(mockUser)
        expect(store.isAuthenticated).toBe(true)
        expect(store.userName).toBe('Test User')
        expect(store.userEmail).toBe('test@example.com')
    })

    it('sets loading state', () => {
        const store = useAuthStore()
        store.setLoading(true)
        expect(store.isLoading).toBe(true)
    })

    it('sets error state', () => {
        const store = useAuthStore()
        store.setError('Something went wrong')
        expect(store.error).toBe('Something went wrong')
    })

    it('clears auth state', () => {
        const store = useAuthStore()
        store.setUser(mockUser)
        store.setLoading(true)
        store.setError('Error')

        store.clearAuth()

        expect(store.user).toBeNull()
        expect(store.isAuthenticated).toBe(false)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
    })

    describe('fetchUser', () => {
        it('fetches and sets user on success', async () => {
            const store = useAuthStore()

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ user: mockUser }),
            } as any)

            await store.fetchUser('token123')

            expect(store.user).toEqual(mockUser)
            expect(store.error).toBeNull()
            expect(store.isLoading).toBe(false)
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/me'),
                expect.objectContaining({
                    headers: { Authorization: 'Bearer token123' },
                })
            )
        })

        it('handles fetch failure', async () => {
            const store = useAuthStore()

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            } as any)

            await store.fetchUser('token123')

            expect(store.user).toBeNull()
            expect(store.error).toBe('Failed to fetch user info')
            expect(store.isLoading).toBe(false)
        })
    })

    describe('logout', () => {
        it('calls logout endpoint and clears state', async () => {
            const store = useAuthStore()
            store.setUser(mockUser)

            global.fetch = vi.fn().mockResolvedValue({ ok: true } as any)

            await store.logout()

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/logout'),
                expect.objectContaining({ method: 'POST' })
            )
            expect(store.user).toBeNull()
        })
    })
})
