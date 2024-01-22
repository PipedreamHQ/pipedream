import northflank from "../../northflank.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "northflank-create-domain",
  name: "Create Domain",
  description: "Creates a new domain on Northflank. [See the documentation](https://northflank.com/docs/v1/api/domains/create-new-domain)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    northflank,
    domainName: {
      propDefinition: [
        northflank,
        "domainName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.northflank.createDomain({
      domainName: this.domainName,
    });
    $.export("$summary", `Successfully created domain: ${this.domainName}`);
    return response;
  },
};
