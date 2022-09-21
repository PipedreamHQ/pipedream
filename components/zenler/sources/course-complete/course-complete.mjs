import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-course-complete",
  name: "Course Complete",
  description: "Emit new event when a course is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#e0160d58-f0c5-8264-7ee2-fb991cd33e1b)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
