import axios from "axios";

export const baseUrl = "http://localhost:3300";

// axios的实例及拦截器配置
const axiosInstance = axios.create({
  baseURL: baseUrl
});

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, "网络错误");
  }
);

//歌单一页限定歌曲数量
export const ONE_PAGE_COUNT = 50;

//顶部的高度
export const HEADER_HEIGHT = 45;

export { axiosInstance };