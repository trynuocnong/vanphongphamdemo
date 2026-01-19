import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export function usePagination() {
  const [location, setLocation] = useLocation();

  const getPageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("page")) || 1;
  };

  const [currentPage, setCurrentPage] = useState(getPageFromUrl);

  // Sync page → URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(currentPage));
    setLocation(`${location.split("?")[0]}?${params.toString()}`, {
      replace: true,
    });
  }, [currentPage]);

  return { currentPage, setCurrentPage };
}
