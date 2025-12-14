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

export async function loginUser(email: string, password: string, role: string) {
  const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`;
  console.log("Login query:", `${API_URL}/users?${query}`);
  
  const res = await fetch(`${API_URL}/users?${query}`);
  const data = await res.json();
  console.log("Login result:", data);
  return data[0]; // undefined nếu sai
}


