import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-lesson-complete",
  name: "Lesson Complete",
  description: "Emit new event when a lesson is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#ad904518-bab0-5e8c-ed81-0f9efe508812)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
