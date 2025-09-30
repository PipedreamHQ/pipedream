import interzoid from "../../interzoid.app.mjs";

export default {
  key: "interzoid-get-full-name-match",
  name: "Get Full Name Match Score",
  description: "Retrieve a match score (likelihood of matching) between two individual names on a scale of 0-100. [See the documentation](https://www.interzoid.com/apis/individual-match-score)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    interzoid,
    fullname1: {
      type: "string",
      label: "Full Name 1",
      description: "Full name of the first person",
    },
    fullname2: {
      type: "string",
      label: "Full Name 2",
      description: "Full name of the second person",
    },
  },
  async run({ $ }) {
    const response = await this.interzoid.getFullNameMatch({
      $,
      params: {
        fullname1: this.fullname1,
        fullname2: this.fullname2,
      },
    });

    $.export("$summary", "Successfully retrieved match score.");

    return response;
  },
};
