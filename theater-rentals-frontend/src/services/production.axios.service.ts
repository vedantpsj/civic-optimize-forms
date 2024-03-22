import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export enum API_URL {
  MANAGE_INVENTORY = "production/manage-inventory",
  TOKENS = "auth",
  GET_SHOW_TITLES = "production/get-show-titles",
  GET_DETAILS = "production/get-details",
  VALIDATE = "production/validate",
  UPLOAD = "https://content.civicplus.com/api/apps/ut-sandycity/assets?publish=true",
  GET_IMAGE = "https://content.civicplus.com/api/apps/ut-sandycity/assets",
}

export interface IDataObject {
  url: string;
  data?: object;
  headers?: object;
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
    async uploadFile(file: File, headers: any, permissionSet: string) {
      var data = new FormData();
      data.append("file", file);
      data.append("permissionSet", permissionSet);
      return axios.post(API_URL.UPLOAD, data, { headers: headers });
    },
    async getFile(url: string, headers: any) {
      return axios.get(url, {
        headers: headers,
      });
    },
  };
};

export default UseApiService;
