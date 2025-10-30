export default {
  eventName: "user.update",
  data: {
    id: "507f1f77bcf86cd799439013",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    country: "US",
    updatedAt: "2024-01-15T16:20:00Z",
  },
  audit: {
    phone: {
      old: null,
      new: "+1234567890",
    },
  },
};
