import { create } from 'zustand';

const useWhatsAppStore = create((set) => ({
    isClientReady: false,
    setClientReady: (status) => set({ isClientReady: status }),
}));

export default useWhatsAppStore;