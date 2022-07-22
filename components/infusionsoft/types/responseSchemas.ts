type appointment = {
  title: string;
};

type company = {
  company_name: string;
  id: number;
};

type contact = {
  given_name: string;
  id: number;
};

type order = {
  contact: {
    first_name: string;
    last_name: string;
  };
  id: number;
  order_items: object[];
  total: number;
};

type product = {
  id: number;
  product_name: string;
  product_price: number;
};

type transaction = {
  amount: number;
  order_ids: string;
};

type webhook = {
  key: string;
};

type webhookObject = {
  apiUrl: string;
  id: number;
  timestamp: string;
};

export {
  appointment,
  company,
  contact,
  order,
  product,
  transaction,
  webhook,
  webhookObject,
};
