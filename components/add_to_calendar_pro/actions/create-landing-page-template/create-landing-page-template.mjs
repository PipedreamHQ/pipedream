import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-create-landing-page-template",
  name: "Create Landing Page Template",
  description: "Create a landing page template. [See the documentation](https://docs.add-to-calendar-pro.com/api/landingpages#add-a-landing-page-template)",
  version: "0.0.2",
  type: "action",
  props: {
    addToCalendarPro,
    name: {
      propDefinition: [
        addToCalendarPro,
        "landingPageTemplateName",
      ],
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
    const response = await this.addToCalendarPro.createLandingPageTemplate({
      $,
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
    $.export("$summary", "Successfully created landing page template.");
    return response;
  },
};
