import mattermost from "../../app/mattermost.app";
import { defineAction } from "@pipedream/types";
import {
  VerifyEmailParams, VerifyEmailResponse,
} from "../../common/types";

export default defineAction({
  name: "Post Message",
  description:
    "Post a message [See docs here]()",
  key: "mattermost-post-message",
  version: "0.0.1",
  type: "action",
  props: {
    mattermost,
    email: {
      label: "Email Address",
      description: "An email address to be verified.",
      type: "string",
    },
  },
  async run({ $ }): Promise<VerifyEmailResponse> {
    const params: VerifyEmailParams = {
      $,
      params: {
        email: this.email,
      },
    };
    const data: VerifyEmailResponse = await this.mattermost.verifyEmailAddress(params);

    $.export("$summary", `Verified email ${data.email} (${data.result})`);

    return data;
  },
});
