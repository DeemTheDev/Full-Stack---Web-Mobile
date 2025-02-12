import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface BlogPost {
  id: string;
  orgId: string;
  content: string;
  type: string;
  createdAt: string;
}

declare interface SocialLinks{
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
}

declare interface OrganisationImage {
  id: number;
  organisation_id: number;
  image_url: string;
  created_at: string;
}

declare interface Organisation {
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

declare interface OrganisationStore {
  selectedOrg: Organisation | null;
  organisations: Organisation[];
  organisationData: OrgData[];
  organisationImages: Record<number, OrganisationImage[]>; // Images by org ID
  donationHistory: DonationHistory[];
  setSelectedOrg: (org: Organisation) => void;
  clearSelectedOrg: () => void;
  setOrganizations: (orgs: Organisation[]) => void;
  setOrganisationImages: (orgId: number, images: OrganisationImage[]) => void;
  setDonationHistory: (donations: DonationHistory[]) => void;
}

// Interface for donation history 
  declare interface DonationHistory{
    id: number;
    amount: string;
    date: string; 
    orgId: string; 
    donor_id: string;
    
  };
// For history card 
  interface HistoryCardProps {
  history: DonationHistory;
}


declare interface PaymentProps extends TouchableOpacityProps {
  fullName: string | null;
  email: string;
  amount: string | null;
  organisationId: number | null;

}

interface OrganizationPaymentCardProps {
  item: Organisation;
  amount: number;
  activeInput: number | null;
  setActiveInput: (id: number) => void;
  setAmount: (amount: string) => void;
  handlePayment: (item: Organisation) => void;
}



declare interface PaymentStore{
  paymentData: PaymentProps | null;

  setPayment: (payment: PaymentProps) => void;
}

// Update OrgData interface to match database requirements
declare interface OrgData {
  id: number;
  origin_address: string;
  payment_status: string;
  organisation_id: number;
  organisation_description: string;
  user_id: string;
  created_at: string;
  organisation: Organisation;
}

// Update OrgCardProps to use the Organization type
declare interface OrgCardProps {
  org: Organisation;  // Changed from item: UserData
  selected?: number;  // Made optional since it might not always be needed
  setSelected?: () => void;  // Made optional
}

// Keep all other interfaces as they are
declare interface UserData {
  id: number;
  profile_image_url: string;
  imageUrl: string;
  first_name: string;
  last_name: string;
  price?: string;
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}


declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}



declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

declare interface OrgCardProps {
  item: UserData;
  selected: number;
  setSelected: () => void;
}