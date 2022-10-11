import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "vk-new-photo",
  name: "New Photo",
  description: "Emit new event when a photo is created. [See the docs here](https://vk.com/dev/callback_api)",
  type: "source",
  version: "0.0.6",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMetadata(payload) {
      const {
        id,
        date: ts,
      } = payload.photo_new;
      return {
        id,
        ts,
        summary: "New Photo",
      };
    },
  },
});
