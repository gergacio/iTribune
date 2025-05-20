import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
    allUserData: null, // user not log in
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),

    setUser: (user) => set({
        allUserData: user,
    }),
    // func set loading state
    setLoading: (loading) => set({
        loading
    }),

    isLoggedIn: () => get().allUserData !== null,

}));

// attach dev tools to app but only if app (code) is running in development envorinment
if (import.meta.env.DEV) { 
    mountStoreDevtool("Store", useAuthStore)

}

export { useAuthStore };