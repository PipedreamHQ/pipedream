import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, personExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-enrich-person",
  name: "Enrich Person by Email",
  description: "Find the best matching person for a known work email. This is reverse email resolution, not email discovery. Costs 5 credits when found, plus 1 for education if requested. Review the match before updating records. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-enrich)",
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
    email: {
      "type": "string",
      "label": "Work Email",
      "description": "Known work email to resolve, e.g. `jane@example.com`.",
    },
    personExpand: {
      propDefinition: [
        companyenrich,
        "personExpand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.enrichPerson({
      $,
      data: {
        email: stringValue(this.email, "Work Email", 320, true),
        expand: personExpansions(this.personExpand),
      },
    });
    $.export("$summary", "Resolved person from work email");
    return response;
  },
};
