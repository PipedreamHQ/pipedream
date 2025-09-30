import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-exclude-contact",
  name: "Exclude Contact",
  description: "Add a contact to the exclusion list. [See the docs](https://apidoc.overloop.com/#create-an-exclusion-list-item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of item to exclude",
      options: [
        "domain",
        "email",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to exclude",
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "exclusion_list_item",
        attributes: {
          item_type: this.itemType,
          value: this.value,
        },
      },
    };

    const { data: response } = await this.overloop.createExclusionListItem({
      data,
      $,
    });

    $.export("$summary", `Successfully added ${this.value} to the exclustion list.`);

    return response;
  },
};
