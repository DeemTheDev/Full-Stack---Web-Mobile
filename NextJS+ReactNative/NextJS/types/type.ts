
export interface UserWithDonations {
  id: number;
  name: string;
  email: string;
  total_donations: number;

}
export interface LoginResult {
  success: boolean;
  error?: string;
  organisationId?: number;
  name?: string;
}
export interface OrganisationSocial {
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
}
export interface CreateOrganisationData {
    name: string;
    email: string;
    description: string | null;
    address: string;
    website: string | null;
    password: string;
}
export interface OrganisationImage {
  id: number;
  organisation_id: number;
  image_url: string;
  created_at: string;
}

export interface Organisation {
  id: number;
  name: string;
  email: string;
  address: string;
  website: string;
  description: string;
  profile_image_url: string;
  image_url: string;
  images?: OrganisationImage[]; // Array of additional images
}

export interface OrganisationWithDonations {
  id: number;
  name: string;
  email: string;
  total_received: number;
}


// Interface for donation history 
export interface  DonationHistory{
    id: number;
    amount: string;
    date: string; 
    orgId: string; 
    donor_id: string;
    
  };

// Blog Posts 
export interface BlogPost {
  id: string;
  orgId: string;
  content: string;
  type: string;
  createdAt: string;
}