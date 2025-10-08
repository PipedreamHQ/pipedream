import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";
import { ConfigurationError } from "@pipedream/platform";

export default defineAction({
  name: "Remove Tag From Student",
  description: "Remove a tag from a student. [See docs](https://howto.xperiencify.com/article.php?article=123#7)",
  key: "xperiencify-remove-tag-from-student",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xperiencify,
    student: {
      propDefinition: [
        xperiencify,
        "student",
      ],
    },
    tags: {
      propDefinition: [
        xperiencify,
        "tags",
        (c) => ({
          studentEmail: c.student,
        }),
      ],
    },
  },
  async run({ $ }) {
    if (!this.tags?.length) {
      throw new ConfigurationError("Must select at least one tag");
    }
    const response = await this.xperiencify.removeTagsFromStudent({
      $,
      data: {
        student_email: this.student,
        tagname: this.tags.join(","),
      },
    });
    $.export("$summary", "Successfully removed tag(s) from student");
    return response;
  },
});
