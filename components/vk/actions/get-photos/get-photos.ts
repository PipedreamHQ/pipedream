import vk from "../../app/vk.app";

export default {
  key: "vk-get-photos",
  name: "Get Photos",
  description: "Returns a list of a user&#39;s or community&#39;s photos. [See the docs here](https://vk.com/dev/photos.get)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
};
