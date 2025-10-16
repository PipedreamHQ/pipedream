export default {
  eventName: "order.update",
  data: {
    id: "507f1f77bcf86cd799439011",
    status: "confirmed",
    amount: 12000,
    currency: "USD",
    experience: {
      id: "507f1f77bcf86cd799439012",
      name: "City Walking Tour",
    },
    user: {
      id: "507f1f77bcf86cd799439013",
      name: "John Doe",
      email: "john@example.com",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:45:00Z",
  },
  audit: {
    status: {
      old: "active",
      new: "confirmed",
    },
  },
};
