import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "rawg_video_games_database",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});
