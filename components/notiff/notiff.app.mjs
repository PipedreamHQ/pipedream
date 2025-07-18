import notiffIo from "../notiff_io/notiff_io.app.mjs";

export default {
  ...notiffIo,
  type: "app",
  app: "notiff",
  methods: {
    ...notiffIo.methods,
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
  },
};
