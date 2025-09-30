import interzoid from "../../interzoid.app.mjs";

export default {
  key: "interzoid-get-organization-match",
  name: "Get Organization Match Score",
  description: "Retrieve a match score (likelihood of matching) from 0-100 between two organization names. [See the documentation](https://www.interzoid.com/apis/organization-match-score)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    interzoid,
    org1: {
      type: "string",
      label: "Organization Name 1",
      description: "Name of the first organization",
    },
    org2: {
      type: "string",
      label: "Organization Name 2",
      description: "Name of the second organization",
    },
  },
  async run({ $ }) {
    const response = await this.interzoid.getOrgMatch({
      $,
      params: {
        org1: this.org1,
        org2: this.org2,
      },
    });

    $.export("$summary", "Successfully retrieved match score.");

    return response;
  },
};
