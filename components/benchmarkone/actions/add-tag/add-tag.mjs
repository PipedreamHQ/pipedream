import benchmarkone from "../../benchmarkone.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "benchmarkone-add-tag",
  name: "Add Tag to Contact",
  description: "Adds tags to a contact. If the contact does not exist, it will be created first. [See the documentation](https://sandbox.hatchbuck.com/api/dist/#/Tags).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    benchmarkone,
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags to add to the contact.",
    },
  },
  async run({ $ }) {
    const response = await this.benchmarkone.addTagToContact({
      contactId: this.contactId,
      data: parseObject(this.tags)?.map((item) => ({
        name: item,
      })),
    });

    $.export("$summary", `Succcessfully added tags to contact ID ${this.contactId}`);
    return response;
  },
};
