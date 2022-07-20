import base from "../../../gorgias/actions/update-customer/update-customer.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// same version as base
// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-update-customer",
  name: "Update Customer",
  description: "Update a customer. [See the docs](https://developers.gorgias.com/reference/put_api-customers-id-)",
  type: "action",
};
