import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-add-tags-to-contact",
  name: "Add Tags to Contact",
  description: "Adds a tag or tags to an existing contact. [See the documentation](https://github.com/agilecrm/rest-api#17-update-tags-value-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    contact: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
    },
    tags: {
      propDefinition: [
        agileCrm,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const tags = Array.isArray(this.tags)
      ? this.tags
      : JSON.parse(this.tags);

    const response = await this.agileCrm.addTagToContact({
      data: {
        id: this.contact,
        tags,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully added tags to contact with ID ${this.contact}`);
    }

    return response;
  },
};
