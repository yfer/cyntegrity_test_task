import auth from "./auth";
import Axios from "axios";
import config from "./config";

export function HTTP() {
  return Axios.create({
    baseURL: config.apiurl,
    headers: {
      Authorization: "Bearer " + auth.getToken()
    }
  });
}
