type company = {
  company_name: string;
  id: number;
};

type contact = {
  given_name: string;
  id: number;
};

type hook = {
  key: string;
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

export { company, contact, hook, order, product };
