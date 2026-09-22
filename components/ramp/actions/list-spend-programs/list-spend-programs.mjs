import ramp from "../../ramp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ramp-list-spend-programs",
  name: "List Spend Programs",
  description: "Retrieve a list of Ramp spend programs. Returns a compact summary of each program by default (id, display_name, description, icon, is_shareable, issue_physical_card_if_needed); pass `fields` to include specific extra fields such as `restrictions`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more programs exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/spend-programs#get-developer-v1-spend-programs)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    pageSize: {
      propDefinition: [
        ramp,
        "pageSize",
      ],
    },
    start: {
      propDefinition: [
        ramp,
        "start",
      ],
    },
    fields: {
      propDefinition: [
        ramp,
        "fields",
      ],
      description: "Optional list of spend-program fields to include per record in addition to the compact default (e.g. `restrictions`, `permitted_spend_types`). Leave empty for the compact summary.",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listSpendPrograms({
      $,
      params: {
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} spend program(s)`);
    return utils.projectList(response, utils.SPEND_PROGRAM_COMPACT_FIELDS, this.fields);
  },
};
