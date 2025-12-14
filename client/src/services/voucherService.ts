const API_URL = "http://localhost:3001";

export async function getVouchers() {
  const res = await fetch(`${API_URL}/vouchers`);
  return res.json();
}

export async function addVoucher(voucher: any) {
  const res = await fetch(`${API_URL}/vouchers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(voucher)
  });
  return res.json();
}

export async function updateVoucher(id: string, voucher: any) {
  const res = await fetch(`${API_URL}/vouchers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(voucher)
  });
  return res.json();
}

export async function deleteVoucher(id: string) {
  const res = await fetch(`${API_URL}/vouchers/${id}`, { method: "DELETE" });
  return res.ok;
}
