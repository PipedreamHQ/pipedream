type Address = {
  id: string;
  first_name: string;
  last_name: string;
  street: string;
  street_no: string;
  zip_code: string;
  city: string;
  country: string;
  email: string;
};

type Shipment = {
  id: string;
  packages: object[];
  price: number;
  to: Address;
};

type ShipmentQuote = {
  shipment_quote: {
    price: number;
  };
};

type Webhook = {
  id: string;
  deactivated: boolean;
};

export {
  Address, Shipment, ShipmentQuote, Webhook
};
