import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "close-search-leads",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Search Leads",
  description: "Search leads with a given field and word. [See the documentation](https://developer.close.com/resources/advanced-filtering/)",
  props: {
    close,
    field: {
      label: "Field",
      description: "Field name which will be searched. e.g. 'name'",
      type: "string",
    },
    text: {
      label: "Text",
      description: "Contained text",
      type: "string",
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.name) data.name = this.name;
    if (this.url) data.url = this.url;
    if (this.statusId) data.status_id = this.statusId;
    if (this.contacts) data.contacts = utils.parseObject(this.contacts);
    if (this.addresses) data.addresses = utils.parseObject(this.addresses);
    const moreFields = {};
    for (let key in this.moreFields) {
      moreFields[key] = utils.parseObject(this.moreFields[key]);
    }
    const response = await this.close.searchLeads({
      data: {
        query: {
          queries: [
            {
              object_type: "lead",
              type: "object_type",
            },
            {
              type: "field_condition",
              field: {
                object_type: "lead",
                type: "regular_field",
                field_name: this.field,
              },
              condition: {
                type: "text",
                mode: "full_words",
                value: this.text,
              },
            },
          ],
          type: "and",
        },
      },
    });
    $.export("$summary", `${response.data.data.length} Lead${response.data.data.length === 1
      ? " has"
      : "s have"} been found.`);
    return response.data;
  },
};
