import base from "../../../gorgias/actions/update-customer/update-customer.mjs";

export default {
  ...base,
  key: "gorgias_oauth-update-customer",
  name: "Update Customer",
  description: "Update a customer. [See the docs](https://developers.gorgias.com/reference/put_api-customers-id-)",
  version: "0.0.1",
  type: "action",
};
