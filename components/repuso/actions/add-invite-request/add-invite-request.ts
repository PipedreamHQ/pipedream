import repuso from "../../app/repuso.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Add Invite Request",
  description:
    "Add an invite request [See docs here](https://documenter.getpostman.com/view/4975691/TzzGFYg3#f417c9ce-2376-495c-85c3-bdcfc204eee2)",
  key: "repuso-add-invite-request",
  version: "0.0.1",
  type: "action",
  props: {
    repuso,
  },
  async run({ $ }): Promise<any> {
    const params = {
      $,
      data: {
        
      },
    };
    const data = await this.repuso.addInviteRequest(params);

    $.export("$summary", "");

    return data;
  },
});
