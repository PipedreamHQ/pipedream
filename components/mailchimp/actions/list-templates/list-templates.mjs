import constants from "../../common/constants.mjs";
import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-list-templates",
  name: "List Templates",
  description: "Lists the email templates in the account, including each template's numeric `id`. Use this to find the **Template ID** for **Edit A Campaign Template Content**. [See docs here](https://mailchimp.com/developer/marketing/api/templates/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    mailchimp,
    type: {
      type: "string",
      label: "Type",
      description: "Only return templates of this type, e.g. `user`. `user` templates are the ones created in your account.",
      optional: true,
      options: [
        "user",
        "base",
        "gallery",
      ],
    },
    sortField: {
      type: "string",
      label: "Sort field",
      description: "The field to sort results by, e.g. `name`.",
      optional: true,
      options: [
        "date_created",
        "date_edited",
        "name",
      ],
    },
    sortDir: {
      type: "string",
      label: "Sort direction",
      description: "The order of the sorted results, e.g. `ASC`.",
      optional: true,
      options: constants.SORT_DIRECTIONS,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The number of templates to return, e.g. `25`. Maximum is 1000.",
      optional: true,
      default: 10,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of templates to skip, for pagination, e.g. `10` to get the second page when **Count** is 10.",
      optional: true,
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const params = removeNullEntries({
      type: this.type,
      sort_field: this.sortField,
      sort_dir: this.sortDir,
      count: this.count,
      offset: this.offset,
      // link objects add a lot of tokens and no usable information
      exclude_fields: "_links,templates._links",
    });
    const response = await this.mailchimp.listTemplates($, params);
    const total = response?.total_items ?? 0;
    $.export("$summary", `Found ${total} template${total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
