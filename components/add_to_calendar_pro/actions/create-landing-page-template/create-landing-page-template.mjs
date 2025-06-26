import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-create-landing-page-template",
  name: "Create Landing Page Template",
  description: "Create a landing page template. [See the documentation](https://docs.add-to-calendar-pro.com/api/landingpages#add-a-landing-page-template)",
  version: "0.0.1",
  type: "action",
  props: {
    addToCalendarPro,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the landing page template",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the landing page template",
      optional: true,
    },
    intro: {
      type: "string",
      label: "Intro",
      description: "The intro of the landing page template",
      optional: true,
    },
    legal: {
      type: "string",
      label: "Legal",
      description: "The legal footer text; allows for HTML",
      optional: true,
    },
    highlightColor: {
      type: "string",
      label: "Highlight Color",
      description: "Hex code; used for buttons and decorative elements",
      optional: true,
    },
    backgroundColor1: {
      type: "string",
      label: "Background Color 1",
      description: "Hex code; used for the background of the template",
      optional: true,
    },
    backgroundColor2: {
      type: "string",
      label: "Background Color 2",
      description: "Hex code; used for the background of the template",
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "Background of the template",
      options: [
        "solid",
        "gradient",
        "image",
        "preset",
      ],
      optional: true,
    },
    gradientDirection: {
      type: "string",
      label: "Gradient Direction",
      description: "The direction of the gradient. Only used if `background` is `gradient`.",
      options: [
        "linear-t",
        "linear-tr",
        "linear-r",
        "linear-br",
        "radial",
      ],
      optional: true,
    },
    imageRepeat: {
      type: "boolean",
      label: "Image Repeat",
      description: "Whether to show the background image fullscreen or repeat it",
      optional: true,
    },
    metaTitleOverride: {
      type: "string",
      label: "Meta Title Override",
      description: "Text that overrides the auto-generated meta title",
      optional: true,
    },
    metaDescriptionOverride: {
      type: "string",
      label: "Meta Description Override",
      description: "Text that overrides the auto-generated meta description",
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
      },
    });
    $.export("$summary", "Successfully created landing page template.");
    return response;
  },
};
