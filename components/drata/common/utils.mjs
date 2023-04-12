export default {
  methods: {
    initializeJsonProps(ctx, props) {
      for (const prop of props) {
        if (ctx[prop] && typeof ctx[prop] === "string") {
          try {
            ctx[prop] = JSON.parse(ctx[prop]);
          } catch (e) {
            // do nothing
          }
        }
      }
    },
  },
};
