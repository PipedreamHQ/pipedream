import streamlabs from "../../streamlabs.app.mjs";

export default {
  key: "streamlabs-send-test-alert",
  name: "Send Test Alert",
  description: "Send a test alert to the stream overlay in StreamLabs. [See the documentation](https://dev.streamlabs.com/reference/alertssend_test_alert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamlabs,
    platform: {
      type: "string",
      label: "Platform",
      description: "The streaming platform",
      options: [
        "twitch",
        "youtube",
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    if (!this.platform) {
      return {};
    }
    const props = {
      type: {
        type: "string",
        label: "Type",
        description: "The type of the alert",
      },
    };
    if (this.platform === "twitch") {
      props.type.options = [
        "follow",
        "subscription",
        "donation",
        "host",
        "bits",
        "raid",
      ];
    }
    if (this.platform === "youtube") {
      props.type.options = [
        "subscription",
        "sponsor",
        "superchat",
        "donation",
      ];
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.streamlabs.sendTestAlert({
      $,
      data: {
        platform: this.platform,
        type: this.type,
      },
    });
    $.export("$summary", "Successfully sent test alert");
    return response;
  },
};
