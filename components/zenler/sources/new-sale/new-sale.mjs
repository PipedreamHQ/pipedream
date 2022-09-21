import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-new-sale",
  name: "New Sale",
  description: "Emit new event when a sale is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#5b964b29-b972-ec8e-3e65-df2ff33a6ad8)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
