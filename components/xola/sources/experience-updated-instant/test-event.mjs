export default {
  eventName: "experience.update",
  data: {
    id: "507f1f77bcf86cd799439012",
    name: "City Walking Tour",
    description: "Explore the historic downtown area with expert guides",
    duration: 150,
    price: 5500,
    currency: "USD",
    category: "Tours",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
  },
  audit: {
    description: {
      old: "Explore the historic downtown area",
      new: "Explore the historic downtown area with expert guides",
    },
    duration: {
      old: 120,
      new: 150,
    },
    price: {
      old: 5000,
      new: 5500,
    },
  },
};
