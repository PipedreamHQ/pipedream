import common from "@pipedream/notiff_io/actions/create-notification/create-notification.mjs";
import { adjustPropDefinitions } from "../../common/utils.mjs";
import app from "../../notiff.app.mjs";

const props = adjustPropDefinitions(common.props, app);

export default {
  ...common,
  key: "notiff-create-notification",
  name: "Create Notification",
  description: "Send a new notification to a user or system via notiff.io. [See the documentation](https://notiff.io/articles/welcome-to-notiff-getting-started-with-your-notification-center)",
  version: "0.0.3",
  type: "action",
  methods: {
    getNotificationSourceId() {
      return this.app.$auth.notification_source_id;
    },
  },
  props: {
    app,
    ...props,
  },
};
