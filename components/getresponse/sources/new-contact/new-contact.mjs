import app from "../../getresponse.app.mjs";

export default {
  key: "getresponse-new-contact",
  name: "New Contact",
  description: "Emit new event when a contact is created. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/getContactList)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
