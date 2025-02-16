import common from "../common/webhook.mjs";
import component from "../../../launchdarkly/sources/new-access-token-event/new-access-token-event.mjs";

const {
  name, description, type,
} = component;

export default {
  ...component,
  key: "launch_darkly_oauth-new-access-token-event",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    ...common.props,
    memberId: {
      propDefinition: [
        common.props.app,
        "memberId",
      ],
    },
  },
};
