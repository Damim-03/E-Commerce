// Capitalize first letter safely
export const capitalizeText = (text?: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Order status badge
export const getOrderStatusBadge = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "badge-success";
    case "shipped":
      return "badge-info";
    case "pending":
      return "badge-warning";
    default:
      return "badge-ghost";
  }
};

// Stock status badge
export const getStockStatusBadge = (
  stock?: number
): { text: string; class: string } => {
  if (stock === undefined || stock === null) {
    return { text: "Unknown", class: "badge-ghost" };
  }

  if (stock === 0) {
    return { text: "Out of Stock", class: "badge-error" };
  }

  if (stock < 20) {
    return { text: "Low Stock", class: "badge-warning" };
  }

  return { text: "In Stock", class: "badge-success" };
};

// Date formatter
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
