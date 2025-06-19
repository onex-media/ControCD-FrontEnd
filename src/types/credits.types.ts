export type CreateCreditPayload = {
  sellerId: number | null;
  creditValue: number | null;
  interestRate: number | null;
  installmentCount: number | null;
  paymentFrequency: string | null;
  excludedDays: string[];
  microInsurancePercentage: number | null;
  microInsuranceAmount: number | null;
  firstInstallmentDate: string | null;
  clientId: number | null;
  galleryPhotos: File[];
};

export type CreditData = {
  current_page: number;
  data: Array<{
    id: number;
    creditValue: number | null;
    interestRate: number | null;
    installmentCount: number | null;
    paymentFrequency: string | null;
    excludedDays: string[];
    microInsurancePercentage: number | null;
    microInsuranceAmount: number | null;
    firstInstallmentDate: string | null;
    clientId: number | null;
    gallery_photos: string[] | null;
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

export type CreditGetResponse = {
  code: string;
  data: {
    success: boolean;
    message: string;
    data: CreditData;
  };
};
