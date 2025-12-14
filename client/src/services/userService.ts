const API_URL = "http://localhost:3001";

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
