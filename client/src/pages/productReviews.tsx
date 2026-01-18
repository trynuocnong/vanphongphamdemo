import { Review } from '@/types';

export default function ProductReviews({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet</p>;
  }

  return (
    <ul>
      {reviews.map(r => (
        <li key={r.id}>
          <strong>{r.userName}</strong> – {r.rating} ⭐
          <p>{r.comment}</p>
          <small>
            {new Date(r.createdAt).toLocaleDateString()}
          </small>
        </li>
      ))}
    </ul>
  );
}
