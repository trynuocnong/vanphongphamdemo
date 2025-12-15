const API_URL = "http://localhost:3001";

export async function getOffers() {
  const res = await fetch(`${API_URL}/offers`);
  return res.json();
}

export async function createOffer(data: any) {
  return fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateOffer(id: string, data: any) {
  return fetch(`${API_URL}/offers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
