import stealthSeminar from "../../stealthseminar.app.mjs";

export default {
  key: "stealthseminar-get-registration-information",
  name: "Get Registration Information",
  description: "Get registration information for a webinar. [See the documentation](https://docs.stealthseminarapp.com/#get-registration-information)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stealthSeminar,
    shortId: {
      propDefinition: [
        stealthSeminar,
        "shortId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stealthSeminar.getRegistrationInformation({
      $,
      shortId: this.shortId,
    });
    $.export("$summary", `Successfully retrieved registration information for webinar ${this.shortId}.`);
    return response;
  },
};
