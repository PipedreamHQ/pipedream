import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-get-landing-page-template",
  name: "Get Landing Page Template",
  description: "Get a landing page template. [See the documentation](https://docs.add-to-calendar-pro.com/api/landingpages#get-one-landing-page-template)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addToCalendarPro,
    landingPageTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "landingPageTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.getLandingPageTemplate({
      $,
      landingPageTemplateId: this.landingPageTemplateId,
    });
    $.export("$summary", "Successfully retrieved landing page template.");
    return response;
  },
};
