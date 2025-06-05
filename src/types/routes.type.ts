import {
  createRouteResponseSchema,
  updateRouteResponseSchema,
  deleteRouteResponseSchema,
  routesResponseSchema,
} from "../schemas/routes.schema";
import { z } from "zod";


interface User {
  id: number;
  name: string;
}

export interface Route {
  id: number;
  name: string;
  dni: string;
  country_id: number;
  city_id: number;
  profilePhoto: any
  user_routes: UserRoute[];
}

interface UserRoute {
  user: User;
}


export interface dataRoutes {
  current_page: number;
  data: Route[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number | null;
  total?: number;
}


export type createRoutePayload = {
  name: string;
  dni: string;
  country_id: number;
  city_id: number;
  members?: any[] | undefined;
  profilePhoto?: File;
};

export type updateRoutePayload = {
  name: string;
  dni: string;
  city_id: number;
  members?: any[];
};

export type createRouteResponse = z.infer<typeof createRouteResponseSchema>;
export type routesResponse = z.infer<typeof routesResponseSchema>;
export type updateRouteResponse = z.infer<typeof updateRouteResponseSchema>;
export type deleteRouteResponse = z.infer<typeof deleteRouteResponseSchema>;
