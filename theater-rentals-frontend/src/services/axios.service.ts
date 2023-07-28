import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export enum API_URL {
  MANAGE_INVENTORY = "manage-inventory",
  GET_SHOW_TITLES = "get-show-titles",
  GET_TITLES = "get-titles",
  GET_DETAILS = "get-details",
  VALIDATE = "validate",
  UPLOAD = "https://content.civicplus.com/api/apps/ut-sandycity/assets/",
}

export interface IDataObject {
  url: string;
  data?: object;
}
const UseApiService = () => {
  return {
    async post(obj: IDataObject) {
      return axios.post(API_BASE_URL + obj.url, {
        ...obj.data,
      });
    },
    async get(obj: IDataObject) {
      return axios.get(API_BASE_URL + obj.url, {
        params: {
          ...obj.data,
        },
      });
    },
    async uploadFile(file: File, url: string) {
      const payload = {
        url: url,
        data: file,
        headers: {
          "Content-Type": file.type,
          Authorization: process.env.REACT_APP_HCMS_TOKEN,
        },
      };
      return axios.post(payload.url, payload.data, {
        headers: {
          ...payload.headers,
        },
      });
    },
  };
};

export default UseApiService;
