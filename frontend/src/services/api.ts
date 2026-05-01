import { request } from "./http";

export const api = {
  getDashboard: async (userId: string) => {
    return request(`/dashboard/${userId}`);
  },
};