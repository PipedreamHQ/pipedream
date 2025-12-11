import app from "../../survicate.app.mjs";

export default {
  key: "survicate-get-personal-data-counters",
  name: "Get Personal Data Counters",
  description: "Retrieves counts of personal data records for GDPR compliance. [See the documentation](https://developers.survicate.com/data-export/personal-data/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to search for across all data sources. The search is case-insensitive and handles whitespace.",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.getPersonalDataCounters({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully retrieved personal data counters");
    return response;
  },
};
