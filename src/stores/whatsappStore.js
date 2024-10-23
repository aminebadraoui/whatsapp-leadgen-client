import { create } from 'zustand';

const useWhatsAppStore = create((set) => ({
    isClientReady: localStorage.getItem('isClientReady') === 'true',
    setClientReady: (ready) => {
        localStorage.setItem('isClientReady', ready);
        set({ isClientReady: ready });
    },
}));

export default useWhatsAppStore;