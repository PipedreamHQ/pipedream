import notiffIo from "@pipedream/notiff_io";

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
