import { adjustPropDefinitions } from "../../common/utils.mjs";
import component from "../../../launchdarkly/actions/evaluate-feature-flag/evaluate-feature-flag.mjs";
import app from "../../launch_darkly_oauth.app.mjs";

const {
  name, description, type, ...others
} = component;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...component,
  key: "launch_darkly_oauth-evaluate-feature-flag",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
