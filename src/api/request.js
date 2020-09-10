import { axiosInstance } from "./config";

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};