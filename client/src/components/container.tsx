export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto px-4 md:px-6"
      style={{ maxWidth: "clamp(1024px, 90vw, 1600px)" }}
    >
      {children}
    </div>
  );
}
