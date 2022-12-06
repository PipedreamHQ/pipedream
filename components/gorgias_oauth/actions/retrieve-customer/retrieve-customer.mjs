import base from "../../../gorgias/actions/retrieve-customer/retrieve-customer.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// same version as base
// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-retrieve-customer",
  name: "Retrieve a Customer",
  description: "Retrieve a customer. [See the docs](https://developers.gorgias.com/reference/get_api-customers-id-)",
  type: "action",
};
