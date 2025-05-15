
export type CreateCityPayload = {
    name: string;
    country_id: number;
    country?: {  
        id: number;
        name: string;
    };
}

export type CityData = {
    current_page: number;
    data: Array<{
        id: number;
        name: string;
        country_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        country?: {  
            id: number;
            name: string;
        };
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


export type CityGetResponse = {
    code: string;
    data: {
        success: boolean;
        message: string;
        data: CityData;
    };
};