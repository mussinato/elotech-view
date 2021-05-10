import axios from "axios";

export default axios.create({
  baseURL: "http://teste-elotech.jelastic.saveincloud.net/api",
  headers: {
    "Content-type": "application/json"
  }
});