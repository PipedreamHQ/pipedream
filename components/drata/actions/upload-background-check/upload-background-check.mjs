import drata from "../../drata.app.mjs";

const docsLink = "https://developers.drata.com/docs/developer-portal/add-background-check-evidence/";

export default {
  key: "drata-upload-background-check",
  name: "Upload Background Check",
  description: `Upload background check for a personnel. [See the documentation](${docsLink}).`,
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drata,
    personnelId: {
      propDefinition: [
        drata,
        "personnelId",
        () => ({
          bgCheckCompliance: false,
        }),
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the background check file.",
    },
    filedAt: {
      type: "string",
      label: "Filed At",
      description: "The ISO 8601 date the background check was filed. E.g. 2021-01-01",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      personnelId,
      url,
      filedAt = new Date()
        .toISOString()
        .split("T")[0],
    } = this;

    const response = await this.drata.uploadBackgroundCheck({
      $,
      personnelId,
      data: {
        url,
        filedAt,
      },
    });

    $.export("$summary", "Succesfully uploaded background check");

    return response;
  },
};
