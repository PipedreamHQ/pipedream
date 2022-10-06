import vk from "../../app/vk.app";

export default {
  key: "vk-create-community",
  name: "Create A Community",
  description: "Creates a new community. [See the docs here](https://vk.com/dev/groups.create)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
};
