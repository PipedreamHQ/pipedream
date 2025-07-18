import app from "../../clio_canada.app.mjs";
import common from "@pipedream/clio/sources/bill-state-updated-instant/bill-state-updated-instant.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "clio_canada-bill-state-updated-instant",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
