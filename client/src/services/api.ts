const BASE_URL = "http://localhost:3001";

export const api = {
  get: (url: string) => fetch(`${BASE_URL}${url}`).then(res => res.json()),

  post: (url: string, data: any) =>
    fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  put: (url: string, data: any) =>
    fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  delete: (url: string) =>
    fetch(`${BASE_URL}${url}`, { method: "DELETE" })
};
