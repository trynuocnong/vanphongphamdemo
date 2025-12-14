const API_URL = "http://localhost:3001";

export async function getOffers() {
  const res = await fetch(`${API_URL}/offers`);
  return res.json();
}

export async function addOffer(offer: any) {
  const res = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offer)
  });
  return res.json();
}

export async function respondToOffer(id: string, status: string) {
  const res = await fetch(`${API_URL}/offers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return res.json();
}
