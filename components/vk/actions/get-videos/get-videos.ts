import vk from "../../app/vk.app";

export default {
  key: "vk-get-videos",
  name: "Get Videos",
  description: "Returns detailed information about videos. [See the docs here](https://vk.com/dev/video.get)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
};
