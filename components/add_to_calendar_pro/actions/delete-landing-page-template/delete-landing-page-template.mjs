import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-delete-landing-page-template",
  name: "Delete Landing Page Template",
  description: "Delete a landing page template. [See the documentation](https://docs.add-to-calendar-pro.com/api/landingpages#delete-a-landing-page-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.addToCalendarPro.deleteLandingPageTemplate({
      $,
      landingPageTemplateId: this.landingPageTemplateId,
    });
    $.export("$summary", "Successfully deleted landing page template.");
    return response;
  },
};
