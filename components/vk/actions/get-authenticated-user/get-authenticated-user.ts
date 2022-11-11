import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineAction({
  key: "vk-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Returns the current account info. [See the docs here](https://vk.com/dev/account.getProfileInfo)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run({ $ }) {
    const response = await this.vk.getProfileInfo();

    $.export("$summary", "Successfully found user info");

    return response;
  },
});
