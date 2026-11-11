import companyenrich from "../../companyenrich.app.mjs";
import { peopleQuery } from "../../common/utils.mjs";

export default {
  key: "companyenrich-preview-people",
  name: "Preview People",
  description: "Preview up to 10 person summaries without consuming credits. Requires the corresponding preview capability on your plan. No pagination or paid expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-search-preview)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    personFilter: {
      propDefinition: [
        companyenrich,
        "personFilter",
      ],
    },
    companyQuery: {
      propDefinition: [
        companyenrich,
        "companyQuery",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.previewPeople({
      $,
      data: peopleQuery(this),
    });
    $.export("$summary", `Previewed ${response.items?.length ?? 0} people`);
    return response;
  },
};
