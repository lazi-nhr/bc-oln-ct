// Dummy product data for development and testing
export const dummyProducts = [
  {
    upi: 1,
    product_name: 'Fake-Pineapple',
    status: 'shipped',
    description: 'Fresh bananas from Ecuador',
    creator: '0x1234...5678',
    created_at: '2024-04-26',
  },
  {
    upi: 2,
    product_name: 'Fake-Apple',
    status: 'new',
    description: 'Organic apples from local farms',
    creator: '0x8765...4321',
    created_at: '2024-04-25',
  },
  {
    upi: 3,
    product_name: 'Fake-Orange',
    status: 'sold',
    description: 'Sweet oranges from Spain',
    creator: '0x2468...1357',
    created_at: '2024-04-24',
  },
  {
    upi: 4,
    product_name: 'Fake-Banana',
    status: 'delivered',
    description: 'Premium pineapples from Costa Rica',
    creator: '0x1357...2468',
    created_at: '2024-04-23',
  },
];

// Product status options
export const PRODUCT_STATUS = {
  NEW: 'new',
  PROCESSED: 'processed',
  PRODUCED: 'produced',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  SOLD: 'sold',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

// Numeric status mapping (matching smart contract values)
export const NUMERIC_STATUS = {
  0: PRODUCT_STATUS.NEW,
  1: PRODUCT_STATUS.PROCESSED,
  2: PRODUCT_STATUS.PRODUCED,
  3: PRODUCT_STATUS.SHIPPED,
  4: PRODUCT_STATUS.RECEIVED,
  5: PRODUCT_STATUS.SOLD,
  6: PRODUCT_STATUS.DELIVERED,
};

// Helper function to convert numeric status to string
export const getStatusString = (numericStatus) => {
  return NUMERIC_STATUS[numericStatus] || 'unknown';
};

// Helper function to format UPI with leading zeros
export const formatUPI = (upi) => String(upi).padStart(5, '0');

// Helper function to get status color
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case PRODUCT_STATUS.NEW:
      return '#00C853'; // Bright Green
    case PRODUCT_STATUS.PROCESSED:
      return '#1E88E5'; // Blue
    case PRODUCT_STATUS.PRODUCED:
      return '#7CB342'; // Light Green
    case PRODUCT_STATUS.SHIPPED:
      return '#6200EA'; // Deep Purple
    case PRODUCT_STATUS.RECEIVED:
      return '#00BCD4'; // Cyan
    case PRODUCT_STATUS.SOLD:
      return '#FFC107'; // Amber
    case PRODUCT_STATUS.DELIVERED:
      return '#9C27B0'; // Purple
    case PRODUCT_STATUS.CANCELLED:
      return '#D32F2F'; // Dark Red
    case PRODUCT_STATUS.REJECTED:
      return '#F44336'; // Light Red
    case PRODUCT_STATUS.IN_TRANSIT:
      return '#FF9800'; // Orange
    case PRODUCT_STATUS.QUALITY_CHECK:
      return '#009688'; // Teal
    default:
      return '#757575'; // Grey
  }
};

export const trackingHistory = [   ["2024-12-20", "47.3769 N, 8.5417 E", "Produced", "CocoaFarmer"], ["2025-01-02", "51.9496 N, 4.1453 E", "Shipped", "ShippingCompany"], ["2025-01-21", "10.3932 N, 75.4832 W", "Received", "Retailer"], ["2025-01-30", "10.3932 N, 75.4832 W", "Sold", "Retailer"]]
