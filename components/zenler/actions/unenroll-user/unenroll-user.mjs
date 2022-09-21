import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-unenroll-user",
  name: "Unenroll User",
  description: "Unenrolls a user from a course. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#faaadc39-5702-bb2c-640f-c76a47c26f82)",
  type: "action",
  version: "0.0.1",
  props: {
    zenler,
  },
  async run() {},
};
