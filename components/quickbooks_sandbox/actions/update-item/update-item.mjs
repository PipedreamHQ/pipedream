import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/update-item/update-item.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-update-item",
  version: "0.2.5",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
