type Appointment = {
  title: string;
};

type Company = {
  company_name: string;
  id: number;
};

type Contact = {
  given_name: string;
  id: number;
};

type Order = {
  contact: {
    first_name: string;
    last_name: string;
  };
  id: number;
  order_items: object[];
  total: number;
};

type Product = {
  id: number;
  product_name: string;
  product_price: number;
};

type Transaction = {
  amount: number;
  order_ids: string;
};

type Webhook = {
  key: string;
};

type WebhookObject = {
  apiUrl: string;
  id: number;
  timestamp: string;
};

export {
  Appointment,
  Company,
  Contact,
  Order,
  Product,
  Transaction,
  Webhook,
  WebhookObject,
};
