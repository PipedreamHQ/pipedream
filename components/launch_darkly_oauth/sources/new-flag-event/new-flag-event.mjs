import common from "../common/webhook.mjs";
import component from "../../../launchdarkly/sources/new-flag-event/new-flag-event.mjs";

const {
  name, description, type,
} = component;

export default {
  ...component,
  key: "launch_darkly_oauth-new-flag-event",
  version: "0.0.1",
  name,
  description,
  type,
  props: common.props,
};
