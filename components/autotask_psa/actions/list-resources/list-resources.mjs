import autotaskPsa from "../../autotask_psa.app.mjs";
import { FILTER_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-list-resources",
  name: "List Resources",
  description:
    "Query resources from Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/ResourcesEntity.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    autotaskPsa,
    filter: {
      type: "object",
      label: "Filter",
      description: FILTER_PROP_DESCRIPTION,
    },
  },
  async run({ $ }) {
    const result = await this.autotaskPsa.queryEntity({
      $,
      entity: "Resources",
      data: this.filter,
    });
    const n = result?.items?.length;
    $.export(
      "$summary",
      typeof n === "number"
        ? `Retrieved ${n} resource(s)`
        : "Retrieved resources from Autotask PSA",
    );
    return result;
  },
};
