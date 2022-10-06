import vk from "../../app/vk.app";

export default {
  key: "vk-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Returns the current account info. [See the docs here](https://vk.com/dev/account.getProfileInfo)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
};
