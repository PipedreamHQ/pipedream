type Shipment = {
  id: string;
  packages: object[];
  price: number;
  to: {
    country: string;
    zip_code: string;
  };
};

export { Shipment };
