import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-new-user",
  name: "New User",
  description: "Emit new event when a user is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#9417d5e4-9951-0933-f562-593e946b52a6)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
