const API_URL = "http://localhost:3001";

export const getProductById = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
};

export const getRelatedProducts = async (
  categoryId: string,
  excludeId: string
) => {
  const res = await fetch(`${API_URL}/products?categoryId=${categoryId}`);
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
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id: string, product: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  return res.ok;
}

/* ========================= 📝 REVIEW / FEEDBACK API ========================= */

export async function addProductFeedback(productId: string, feedback: any) {
  const productRes = await fetch(`${API_URL}/products/${productId}`);
  const product = await productRes.json();

  const updated = {
    ...product,
    feedbacks: [...(product.feedbacks || []), feedback],
  };

  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  return res.json();
}

export async function editProductFeedback(
  productId: string,
  feedbackId: string,
  updates: Partial<{ rating: number; comment: string }>
) {
  const productRes = await fetch(`${API_URL}/products/${productId}`);
  const product = await productRes.json();

  const updatedFeedbacks = (product.feedbacks || []).map((fb: any) =>
    fb.id === feedbackId ? { ...fb, ...updates } : fb
  );

  const updated = { ...product, feedbacks: updatedFeedbacks };

  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  return res.json();
}

export async function deleteProductFeedback(productId: string, feedbackId: string) {
  const productRes = await fetch(`${API_URL}/products/${productId}`);
  const product = await productRes.json();

  const updatedFeedbacks = (product.feedbacks || []).filter(
    (fb: any) => fb.id !== feedbackId
  );

  const updated = { ...product, feedbacks: updatedFeedbacks };

  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  return res.json();
}
