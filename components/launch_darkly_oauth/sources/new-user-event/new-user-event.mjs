import common from "../common/webhook.mjs";
import component from "../../../launchdarkly/sources/new-user-event/new-user-event.mjs";

const {
  name, description, type,
} = component;

export default {
  ...component,
  key: "launch_darkly_oauth-new-user-event",
  version: "0.0.1",
  name,
  description,
  type,
  props: common.props,
};
