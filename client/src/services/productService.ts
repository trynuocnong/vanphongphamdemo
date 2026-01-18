const API_URL = "http://localhost:3001";
import { Product, Review } from '../types';
export const getProductById = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
};

export const getRelatedProducts = async (
  categoryId: string,
  excludeId: string
) => {
  const res = await fetch(
    `${API_URL}/products?categoryId=${categoryId}`
  );
  const data = await res.json();
  return data.filter((p: any) => p.id !== excludeId).slice(0, 4);
};

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function addProduct(product: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function updateProduct(id: string, product: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  return res.ok;
}
export const addReviewToProduct = async (
  productId: string,
  review: Omit<Review, "id" | "createdAt">
): Promise<Product> => {
  // 1️⃣ Lấy product hiện tại
  const productRes = await fetch(`${API_URL}/products/${productId}`);
  if (!productRes.ok) {
    throw new Error("Product not found");
  }

  const product: Product = await productRes.json();

  // 2️⃣ Tạo review mới
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(), // ✅ chuẩn để format date
  };

  // 3️⃣ Gộp review (an toàn khi chưa có reviews)
  const updatedReviews: Review[] = [
    ...(product.reviews ?? []),
    newReview,
  ];

  // 4️⃣ PATCH chỉ field reviews
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviews: updatedReviews }),
  });

  if (!res.ok) {
    throw new Error("Failed to add review");
  }

  return res.json();
};

