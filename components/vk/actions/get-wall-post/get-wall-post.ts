import vk from "../../app/vk.app";

export default {
  key: "vk-get-wall-post",
  name: "Get Wall Post",
  description: "Returns a post from user or community walls by ID. [See the docs here](https://vk.com/dev/wall.getById)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
};
