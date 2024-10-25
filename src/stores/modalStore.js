import { create } from 'zustand';

const useModalStore = create((set) => ({
    isUpgradeModalOpen: false,
    showUpgradeModal: () => set({ isUpgradeModalOpen: true }),
    hideUpgradeModal: () => set({ isUpgradeModalOpen: false }),
}));

export default useModalStore;