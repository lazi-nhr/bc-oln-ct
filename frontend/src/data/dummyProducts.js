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
  RETURNED: 'returned',
  COMPLETED: 'completed',
};

// Helper function to normalize status string
export const normalizeStatus = (status) => {
  if (typeof status === 'string') {
    // Convert to lowercase for comparison
    const normalizedStatus = status.toLowerCase();
    // Check if this status exists in our PRODUCT_STATUS values
    const matchingStatus = Object.values(PRODUCT_STATUS).find(s => s === normalizedStatus);
    if (matchingStatus) {
      return matchingStatus;
    }
  }
  return status;
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
  7: PRODUCT_STATUS.CANCELLED,
  8: PRODUCT_STATUS.REJECTED,
  9: PRODUCT_STATUS.RETURNED,
  10: PRODUCT_STATUS.COMPLETED,
};

// Helper function to convert numeric status to string
export const getStatusString = (status) => {
  if (typeof status === 'number') {
    return NUMERIC_STATUS[status] || 'unknown';
  }
  return normalizeStatus(status) || 'unknown';
};

// Helper function to format UPI with leading zeros
export const formatUPI = (upi) => String(upi).padStart(5, '0');

// Helper function to get status color
export const getStatusColor = (status) => {
  // Handle undefined or null status
  if (!status && status !== 0) {
    return '#757575'; // Grey for undefined/null status
  }

  // Normalize the status
  const normalizedStatus = normalizeStatus(status);

  switch (normalizedStatus) {
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
    case PRODUCT_STATUS.RETURNED:
      return '#F44336'; // Light Red
    case PRODUCT_STATUS.COMPLETED:
      return '#00C853'; // Bright Green
    default:
      return '#757575'; // Grey
  }
};
