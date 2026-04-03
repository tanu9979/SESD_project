interface DeliveryEstimate {
  days: number;
  label: string;
  estimatedDate: string;
}

export const getEstimatedDelivery = (sellerPincode?: string, buyerPincode?: string): DeliveryEstimate => {
  let days = 6;
  let label = '5–7 business days';

  if (sellerPincode && buyerPincode) {
    const s = sellerPincode.trim();
    const b = buyerPincode.trim();
    if (s === b)                          { days = 1; label = '1 business day'; }
    else if (s.slice(0, 4) === b.slice(0, 4)) { days = 2; label = '1–2 business days'; }
    else if (s.slice(0, 2) === b.slice(0, 2)) { days = 4; label = '3–4 business days'; }
  }

  const date = new Date();
  date.setDate(date.getDate() + days);
  return { days, label, estimatedDate: date.toDateString() };
};
