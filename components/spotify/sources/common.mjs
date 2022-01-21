import spotify from "../spotify.app.mjs";

export default {
  props: {
    spotify,
    timer: {
      label: "Polling interval",
      description: "How often to poll the Spotify API for new event",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
  },
};
