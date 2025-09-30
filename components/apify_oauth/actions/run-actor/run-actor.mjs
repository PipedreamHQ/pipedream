import app from "../../apify_oauth.app.mjs";
import common from "@pipedream/apify/actions/run-actor/run-actor.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "apify_oauth-run-actor",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    apify: app,
    ...props,
  },
};
