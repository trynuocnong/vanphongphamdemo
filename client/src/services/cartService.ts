import { nanoid } from "nanoid";

const API_URL = "http://localhost:3001";

export const addToCart = async (
  userId: string,
  product: any,
  quantity: number
) => {
  // kiểm tra sản phẩm đã tồn tại trong cart chưa
  const res = await fetch(
    `${API_URL}/carts?userId=${userId}&productId=${product.id}`
  );
  const existing = await res.json();

  // nếu đã có → cộng quantity
  if (existing.length > 0) {
    return fetch(`${API_URL}/carts/${existing[0].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: existing[0].quantity + quantity,
      }),
    });
  }

  // chưa có → tạo mới
  return fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: nanoid(6),
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    }),
  });
};
