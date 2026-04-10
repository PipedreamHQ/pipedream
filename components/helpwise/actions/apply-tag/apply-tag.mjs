import { parseObject } from "../../common/utils.mjs";
import helpwise from "../../helpwise.app.mjs";

export default {
  key: "helpwise-apply-tag",
  name: "Apply Tag",
  description: "Applies tags on conversations. [See the documentation](https://documenter.getpostman.com/view/29744652/2s9YC5yYKf#88c4b377-8f55-4523-b296-201399920dbb)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    helpwise,
    threadIds: {
      propDefinition: [
        helpwise,
        "threadIds",
      ],
    },
    tagIds: {
      propDefinition: [
        helpwise,
        "tagIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpwise.applyTags({
      $,
      data: {
        threadIds: parseObject(this.threadIds),
        tagIds: parseObject(this.tagIds),
      },
    });

    $.export("$summary", "Successfully applied tag(s) to thread(s)");
    return response;
  },
};
