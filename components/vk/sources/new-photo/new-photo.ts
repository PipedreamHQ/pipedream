import { defineSource } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineSource({
  key: "vk-new-photo",
  name: "New Photo",
  description: "Emit new event when a photo is created. [See the docs here](https://vk.com/dev/callback_api)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    vk,
  },
  async run() {
    console.log("run");
  },
});
