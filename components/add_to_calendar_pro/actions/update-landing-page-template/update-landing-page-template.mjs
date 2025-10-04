import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-update-landing-page-template",
  name: "Update Landing Page Template",
  description: "Update a landing page template. [See the documentation](https://docs.add-to-calendar-pro.com/api/landingpages#update-a-landing-page-template)",
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
    name: {
      propDefinition: [
        addToCalendarPro,
        "landingPageTemplateName",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        addToCalendarPro,
        "title",
      ],
    },
    intro: {
      propDefinition: [
        addToCalendarPro,
        "intro",
      ],
    },
    legal: {
      propDefinition: [
        addToCalendarPro,
        "legal",
      ],
    },
    highlightColor: {
      propDefinition: [
        addToCalendarPro,
        "highlightColor",
      ],
    },
    backgroundColor1: {
      propDefinition: [
        addToCalendarPro,
        "backgroundColor1",
      ],
    },
    backgroundColor2: {
      propDefinition: [
        addToCalendarPro,
        "backgroundColor2",
      ],
    },
    background: {
      propDefinition: [
        addToCalendarPro,
        "background",
      ],
    },
    gradientDirection: {
      propDefinition: [
        addToCalendarPro,
        "gradientDirection",
      ],
    },
    imageRepeat: {
      propDefinition: [
        addToCalendarPro,
        "imageRepeat",
      ],
    },
    metaTitleOverride: {
      propDefinition: [
        addToCalendarPro,
        "metaTitleOverride",
      ],
    },
    metaDescriptionOverride: {
      propDefinition: [
        addToCalendarPro,
        "metaDescriptionOverride",
      ],
    },
    metaRobotsOverride: {
      propDefinition: [
        addToCalendarPro,
        "metaRobotsOverride",
      ],
    },
    customDomainId: {
      propDefinition: [
        addToCalendarPro,
        "customDomainId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.updateLandingPageTemplate({
      $,
      landingPageTemplateId: this.landingPageTemplateId,
      data: {
        name: this.name,
        title: this.title,
        intro: this.intro,
        legal: this.legal,
        highlight_color: this.highlightColor,
        background_color_1: this.backgroundColor1,
        background_color_2: this.backgroundColor2,
        background: this.background,
        gradient_direction: this.gradientDirection,
        image_repeat: this.imageRepeat,
        meta_title_override: this.metaTitleOverride,
        meta_description_override: this.metaDescriptionOverride,
        meta_robots_override: this.metaRobotsOverride,
        custom_domain: this.customDomainId,
      },
    });
    $.export("$summary", "Successfully updated landing page template.");
    return response;
  },
};
