import { create } from "zustand";
import { BusinessProfile } from "@/lib/api/business_profile/schema";

interface BusinessProfileState {
  selectedProfile: BusinessProfile | null;
  setSelectedProfile: (profile: BusinessProfile | null) => void;
  getSelectedProfileId: () => string | null;
}

export const useBusinessProfileStore = create<BusinessProfileState>(
  (set, get) => ({
    selectedProfile: null,
    setSelectedProfile: (profile) => set({ selectedProfile: profile }),
    getSelectedProfileId: () => get().selectedProfile?.id || null,
  })
);
