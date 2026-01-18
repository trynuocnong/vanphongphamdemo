const API_URL = "http://localhost:3001";

export const getUserByEmail = async (email: string) => {
  const res = await fetch(`${API_URL}/users?email=${email}`);
  const data = await res.json();
  return data[0];
};

export async function registerUser(user: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(
    `${API_URL}/users?email=${email}&password=${password}`
  );
  const data = await res.json();
  return data[0]; // undefined nếu sai
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
  return res.ok;
}

// Wishlist management
export async function addToWishlist(userId: string, productId: string) {
  // Get current user
  const userRes = await fetch(`${API_URL}/users/${userId}`);
  const user = await userRes.json();

  // Add product to wishlist if not already there
  const wishlist = user.wishlist || [];
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
  }

  // Update user
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishlist })
  });
  return res.json();
}

export async function removeFromWishlist(userId: string, productId: string) {
  // Get current user
  const userRes = await fetch(`${API_URL}/users/${userId}`);
  const user = await userRes.json();

  // Remove product from wishlist
  const wishlist = (user.wishlist || []).filter((id: string) => id !== productId);

  // Update user
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishlist })
  });
  return res.json();
}

// ---------- Address Management ----------
export async function getAddressesByUserId(userId: string) {
  const res = await fetch(`${API_URL}/addresses?userId=${userId}`);
  return res.json();
}

export async function addAddress(address: any) {
  const res = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  return res.json();
}

export async function updateAddress(id: string, address: any) {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  return res.json();
}

export async function deleteAddress(id: string) {
  const res = await fetch(`${API_URL}/addresses/${id}`, { method: "DELETE" });
  return res.ok;
}


