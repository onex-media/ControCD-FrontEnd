export type CreateClientPayload = {
  name: string;
  dni: string;
  address: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  companyName?: string;
  companyAddress?: string;
  guarantorName?: string;
  guarantorDni?: string;
  guarantorAddress?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;
  guarantorAddressCompany?: string;
  guarantorPhoneCompany?: string;
  interestRate: number | null;
  installmentCount: number | null;
  paymentFrequency: string | null;
   excludedDays: string[];
  durationRange: { from: string; to: string } | null;
  creditValue: number | null;
  attachedImages: File[] | any;
  microInsurancePercentage: number | null;
  microInsuranceAmount: number | null;
  firstInstallmentDate: string | null;
  phone: string;
  profilePhoto: File[] | any;
  galleryPhotos: File[];
  email?: string;
  guarantorId?: string | null;
};

export type ClientData = {
  current_page: number;
  data: Array<{
    id: number;
    name: string;
    profile_photo: string | null;
    gallery_photos: string[] | null;
    dni: string;
    address: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
    phone: string;
    email?: string;
    guarantorId?: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    guarantors: any[];
    images: Array<{
      id: number;
      path: string;
      type: string;
      client_id: number;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export type ClientGetResponse = {
  code: string;
  data: {
    success: boolean;
    message: string;
    data: ClientData;
  };
};
