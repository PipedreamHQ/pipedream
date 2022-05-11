import base from "../../../gorgias/actions/create-customer/create-customer.mjs";

export default {
  ...base,
  key: "gorgias_oauth-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs](https://developers.gorgias.com/reference/post_api-customers)",
  version: "0.0.1",
  type: "action",
};
