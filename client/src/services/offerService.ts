import { nanoid } from "nanoid";

const API_URL = "http://localhost:3001";


// ================== CREATE OFFER (USER) ==================
export const createOffer = async (offer: any) => {
  const res = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: nanoid(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...offer,
    }),
  });

  return res.json();
};

// ================== GET ALL (ADMIN) ==================
export const getOffers = async () => {
  const [offersRes, productsRes, usersRes] = await Promise.all([
    fetch("http://localhost:3001/offers"),
    fetch("http://localhost:3001/products"),
    fetch("http://localhost:3001/users"),
  ]);

  const offers = await offersRes.json();
  const products = await productsRes.json();
  const users = await usersRes.json();

  return offers.map((offer: any) => {
    const product = products.find((p: any) => p.id === offer.productId);
    const user = users.find((u: any) => u.id === offer.userId);

    return {
      ...offer,
      productName: product?.name || "Unknown product",
      productImage: product?.image || "",
      originalPrice: product?.price || 0,
      userName: user?.name || offer.userId,
    };
  });
};

// ================== ADMIN RESPOND ==================
export const respondToOffer = async (
  offerId: string,
  status: "pending" | "accepted" | "rejected"
) => {
  const payload: any = { status };

  if (status === "accepted") {
    payload.acceptedAt = new Date().toISOString();
  }

  const res = await fetch(`${API_URL}/offers/${offerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

// ================== DELETE (OPTIONAL) ==================
export const deleteOffer = async (id: string) => {
  return fetch(`${API_URL}/offers/${id}`, { method: "DELETE" });
};
