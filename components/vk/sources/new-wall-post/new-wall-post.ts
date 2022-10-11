import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "vk-new-wall-post",
  name: "New Wall Post",
  description: "Emit new event when a wall post is created. [See the docs here](https://vk.com/dev/callback_api)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMetadata(payload) {
      const {
        id,
        date: ts,
      } = payload.wall_post_new;
      return {
        id,
        ts,
        summary: "New Wall Post",
      };
    },
  },
});
