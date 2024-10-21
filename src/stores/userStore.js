import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    initializeUser: () => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            const user = JSON.parse(userString);
            set({ user });
        }
    },
}));

export default useUserStore;