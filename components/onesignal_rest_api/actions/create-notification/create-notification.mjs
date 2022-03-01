// legacy_hash_id: a_rJiLrx
import { axios } from "@pipedream/platform";

export default {
  key: "onesignal_rest_api-create-notification",
  name: "Create notification",
  description: "Sends notifications to your users",
  version: "0.1.1",
  type: "action",
  props: {
    onesignal_rest_api: {
      type: "app",
      app: "onesignal_rest_api",
    },
    included_segments: {
      type: "any",
      description: "[\"Active Users\", \"Inactive Users\"]",
    },
    contents: {
      type: "object",
      description: "Example: {\"en\": \"English Message\", \"es\": \"Spanish Message\"}",
    },
  },
  async run({ $ }) {
    const data = {
      "app_id": `${this.onesignal_rest_api.$auth.app_id}`,
      "included_segments": this.included_segments,
      "contents": this.contents,
    };

    return await axios($, {
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      headers: {
        "Authorization": `Basic ${this.onesignal_rest_api.$auth.rest_api_key}`,
        "Content-Type": "application/json",
      },
      data,
    });
  },
};
