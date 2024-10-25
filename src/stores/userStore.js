import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    purchases: [], // New state for purchases
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
    fetchUserPurchases: async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/purchases?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch purchases');
            }
            const data = await response.json();
            set({ purchases: data }); // Set the fetched purchases
        } catch (error) {
            console.error('Error fetching user purchases:', error);
            set({ purchases: [] }); // Reset purchases on error
        }
    },
}));

export default useUserStore;