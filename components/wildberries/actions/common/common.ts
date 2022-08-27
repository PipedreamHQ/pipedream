export default {
  stickersRequestType: [
    "code128",
    "qr",
  ],
  orderStatus: [
    {
      label: "New order",
      value: "0",
    },
    {
      label: "Accepted the order",
      value: "1",
    },
    {
      label: "Assembly task completed",
      value: "2",
    },
    {
      label: "Assembly order rejected",
      value: "3",
    },
    {
      label: "On delivery by courier",
      value: "5",
    },
    {
      label: "The client received the goods (courier delivery and pickup)",
      value: "6",
    },
    {
      label: "The client did not accept the goods (courier delivery and pickup)",
      value: "7",
    },
    {
      label: "Goods for pickup from the store accepted for work",
      value: "8",
    },
    {
      label: "Product for self-pickup from the store is ready for pickup",
      value: "9",
    },
  ],
};
