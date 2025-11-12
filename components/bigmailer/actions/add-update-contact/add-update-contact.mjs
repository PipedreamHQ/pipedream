import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-add-update-contact",
  name: "Add or Update Contact",
  description: "Creates or updates a contact within a brand. [See the documentation](https://docs.bigmailer.io/reference/upsertcontact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigmailer,
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
      reloadProps: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact. If the specified email does not exist, a new contact is created. If the specified email exists, the existing contact is updated.",
    },
    listIds: {
      propDefinition: [
        bigmailer,
        "listIds",
        (c) => ({
          brandId: c.brandId,
        }),
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.brandId) {
      return props;
    }
    const fields = await this.getFields();
    for (const field of fields) {
      props[field.id] = {
        type: field.type === "integer"
          ? "integer"
          : "string",
        label: `${field.name}`,
        description: `${field.name} value`,
      };
    }
    return props;
  },
  methods: {
    async getFields() {
      const fields = this.bigmailer.paginate({
        resourceFn: this.bigmailer.listFields,
        args: {
          brandId: this.brandId,
        },
      });
      const results = [];
      for await (const field of fields) {
        if (field.merge_tag_name !== "EMAIL") {
          results.push(field);
        }
      }
      return results;
    },
  },
  async run({ $ }) {
    const fieldValues = [];
    const fields = await this.getFields();
    for (const field of fields) {
      const type = (field.type === "integer" || field.type === "date")
        ? field.type
        : "string";
      fieldValues.push({
        name: field.merge_tag_name,
        [type]: this[field.id],
      });
    }

    const response = await this.bigmailer.upsertContact({
      $,
      brandId: this.brandId,
      data: {
        email: this.email,
        field_values: fieldValues,
        list_ids: this.listIds,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created or updated contact with ID ${response.id}.`);
    }

    return response;
  },
};
