import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance.get("/banner");
}

export const getRecommendListRequest = () => {
  return axiosInstance.get("/personalized");
};

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};

export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};
