// legacy_hash_id: a_oViVNz
import { axios } from "@pipedream/platform";

export default {
  key: "ringcentral-make-callout",
  name: "Make  CallOut",
  description: "Creates a new outbound call out session.",
  version: "0.3.1",
  type: "action",
  props: {
    ringcentral: {
      type: "app",
      app: "ringcentral",
    },
    serverURL: {
      type: "string",
      description: "The base endpoint host used for the RingCentral API.",
      optional: true,
    },
    account_id: {
      type: "string",
      description: "Internal identifier of a RingCentral account.",
    },
    device_id: {
      type: "string",
      description: "Instance id of the caller. It corresponds to the 1st leg of the CallOut call.",
    },
    to: {
      type: "object",
      description: "Phone number of the called party. This number corresponds to the 2nd leg of a CallOut call.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession

    const config = {
      method: "post",
      url: `${this.serverURL}/restapi/v1.0/account/${this.account_id}/telephony/call-out`,
      headers: {
        Authorization: `Bearer ${this.ringcentral.$auth.oauth_access_token}`,
      },
      data: {
        from: {
          deviceId: this.device_id,
        },
        to: this.to,
      },
    };
    return await axios($, config);
  },
};
