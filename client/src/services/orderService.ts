const API_URL = "http://localhost:3001";

// Offers API
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

// Orders API
export async function createOrder(orderData: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
}

export async function getUserOrders(userId: string) {
  const res = await fetch(`${API_URL}/orders?userId=${userId}`);
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
