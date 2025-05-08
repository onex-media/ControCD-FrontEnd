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
  sector: string;
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
  sector: string;
  members?: any[] | undefined;
};

export type updateRoutePayload = {
  name?: string;
  sector?: string;
  members?: any[];
};

export type createRouteResponse = z.infer<typeof createRouteResponseSchema>;
export type routesResponse = z.infer<typeof routesResponseSchema>;
export type updateRouteResponse = z.infer<typeof updateRouteResponseSchema>;
export type deleteRouteResponse = z.infer<typeof deleteRouteResponseSchema>;
