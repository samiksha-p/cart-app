import axios from "axios";

export default class axiosService {
  constructor() {}
  fetchData(iParam) {
    const req = axios(iParam);
    console.log("req", req);
    return req
      .then(response => {
        console.log(" ****** axios then ****", response);
        return response;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}
