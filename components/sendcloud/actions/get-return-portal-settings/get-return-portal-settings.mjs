import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-return-portal-settings",
  name: "Get Return Portal Settings",
  description: "Get return portal settings for the current brand/user. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/return-portal/operations/get-a-brand-return-portal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    brandDomain: {
      propDefinition: [
        app,
        "brandDomain",
        () => ({
          mapper: ({
            name: label,
            domain: value,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "Translate the portal and context to this language.",
      optional: true,
      options: [
        "en-GB",
        "de-DE",
        "es-ES",
        "fr-FR",
        "nl-NL",
        "it-IT",
        "en-US",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      brandDomain,
      language,
    } = this;

    const response = await app.getReturnPortalSettings({
      $,
      brandDomain,
      params: {
        language,
      },
    });

    $.export("$summary", "Successfully retrieved return portal settings");

    return response;
  },
};

