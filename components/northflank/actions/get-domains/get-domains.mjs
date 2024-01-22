import northflank from "../../northflank.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "northflank-get-domains",
  name: "Get Domains",
  description: "List all domains with pagination. [See the documentation](https://northflank.com/docs/v1/api/domains/list-domains)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    northflank,
    paginationPage: {
      propDefinition: [
        northflank,
        "paginationPage",
      ],
    },
  },
  async run({ $ }) {
    const domains = await this.northflank.listDomains({
      paginationPage: this.paginationPage,
    });

    $.export("$summary", `Retrieved ${domains.length} domains`);
    return domains;
  },
};
