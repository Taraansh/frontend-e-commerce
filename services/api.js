import axios from "axios";

// export interface responsePayload {
//   success: boolean;
//   result: any;
//   message: string;
// }

const responseBody = (response) => response.data;

const requests = {
  get: (url) =>
    axios.get(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url).then(responseBody),
  post: (url, body) =>
    axios
      .post(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then(responseBody),
  put: (url, body) =>
    axios
      .put(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then(responseBody),
  del: (url) =>
    axios
      .delete(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url)
      .then(responseBody),
  patch: (url, body) =>
    axios
      .patch(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then(responseBody),
};

const Api = {
  get: (url) => requests.get(url),
  post: (url, body) => requests.post(url, body),
  put: (url, body) => requests.put(url, body),
  del: (url) => requests.del(url),
  patch: (url, body) => requests.patch(url, body),
};

export default Api;
