import { create } from "zustand";
import {  OrganisationStore, PaymentStore, DonationHistory } from '@/types/type';

// For storing Organisation Data 
export const useOrganisationStore = create<OrganisationStore>((set) => ({
  // Initial state
  selectedOrg: null,
  organisations: [],
  organisationData: [],
  organisationImages: {},
  donationHistory: [],

  // Action implementations
  setSelectedOrg: (org) => {
  // When user clicks on an organization card
    set({ selectedOrg: org })
  },
  
  clearSelectedOrg: () => {
    // When user navigates away or needs to clear selection
    set({ selectedOrg: null })
  },
  
  setOrganizations: (orgs) => {
    // When fetching organizations from API
    set({ organisations: orgs })
  },
  setOrganisationImages: (orgId, images) => {
    set((state) => ({
      organisationImages: {
        ...state.organisationImages,
        [orgId]: images
      }
    }));
  },

  setDonationHistory: (donations: DonationHistory[]) => {
    set({ donationHistory: donations });
  }

}));


// For storing payment state data 
export const usePaymentStore = create<PaymentStore>((set)=>({
paymentData: null,
setPayment: (payment) => {
  set({paymentData: payment})
},

}));