import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-new-live-class-registration",
  name: "New Live Class Registration",
  description: "Emit new event when a new live class is registered. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#1966fea2-8274-49bd-f96d-54c215f9d303)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
