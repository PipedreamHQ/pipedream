import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";
import { ConfigurationError } from "@pipedream/platform";

export default defineAction({
  name: "Add Tag To Student",
  description: "Add a tag to a student. [See docs](https://howto.xperiencify.com/article.php?article=123#6)",
  key: "xperiencify-add-tag-to-student",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      // no way to list all tags
      type: xperiencify.propDefinitions.tags.type,
      label: xperiencify.propDefinitions.tags.label,
      description: xperiencify.propDefinitions.tags.description,
    },
  },
  async run({ $ }) {
    if (!this.tags?.length) {
      throw new ConfigurationError("Must select at least one tag");
    }
    const response = await this.xperiencify.addTagsToStudent({
      $,
      data: {
        student_email: this.student,
        tagname: this.tags.join(","),
      },
    });
    $.export("$summary", "Successfully added tag(s) to student");
    return response;
  },
});
