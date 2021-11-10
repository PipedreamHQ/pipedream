import spotify from "../spotify.app.mjs";

export default {
  props: {
    spotify,
    timer: {
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
