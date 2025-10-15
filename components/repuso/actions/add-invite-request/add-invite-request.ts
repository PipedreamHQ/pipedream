import repuso from "../../app/repuso.app";
import { defineAction } from "@pipedream/types";
import {
  AddInviteRequestParams, InviteRequest,
} from "../../common/types";

export default defineAction({
  name: "Add Invite Request",
  description:
    "Add an invite request [See docs here](https://documenter.getpostman.com/view/4975691/TzzGFYg3#f417c9ce-2376-495c-85c3-bdcfc204eee2)",
  key: "repuso-add-invite-request",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    repuso,
    recipient: {
      type: "string",
      label: "Recipient Email",
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Use a date/time string such as `2021-08-30 16:00:00`, or leave empty for the default settings",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
    },
  },
  async run({ $ }): Promise<InviteRequest> {
    const params: AddInviteRequestParams = {
      $,
      data: {
        name: this.name,
        recipient: this.recipient,
        schedule: this.schedule,
      },
    };
    const data: InviteRequest = await this.repuso.addInviteRequest(params);

    $.export("$summary", `Successfully added invite request (id ${data.id})`);

    return data;
  },
});
