import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  language: {
    type: "string",
    label: "Language",
    description: "The language of the page.",
    options: LANGUAGE_OPTIONS,
    optional: true,
  },
  enableLayoutStylesheets: {
    type: "boolean",
    label: "Enable Layout Stylesheets",
    description: "Whether to enable layout stylesheets.",
    optional: true,
  },
  metaDescription: {
    type: "string",
    label: "Meta Description",
    description: "The meta description of the page.",
    optional: true,
  },
  attachedStylesheets: {
    type: "string[]",
    label: "Attached Stylesheets",
    description: "The stylesheets attached to the page.",
    optional: true,
  },
  password: {
    type: "string",
    label: "Password",
    description: "The password of the page.",
    optional: true,
  },
  publishImmediately: {
    type: "boolean",
    label: "Publish Immediately",
    description: "Whether to publish the page immediately.",
    optional: true,
  },
  htmlTitle: {
    type: "string",
    label: "HTML Title",
    description: "The HTML title of the page.",
    optional: true,
  },
  translations: {
    type: "object",
    label: "Translations",
    description: "The translations of the page.",
    optional: true,
  },
  layoutSections: {
    type: "object",
    label: "Layout Sections",
    description: "The layout sections of the page.",
    optional: true,
  },
  footerHtml: {
    type: "string",
    label: "Footer HTML",
    description: "The footer HTML of the page.",
    optional: true,
  },
  headHtml: {
    type: "string",
    label: "Head HTML",
    description: "The head HTML of the page.",
    optional: true,
  },
  templatePath: {
    propDefinition: [
      hubspot,
      "templatePath",
    ],
    optional: true,
  },
  widgetContainers: {
    type: "object",
    label: "Widget Containers",
    description: "A data structure containing the data for all the modules inside the containers for this page",
    optional: true,
  },
  widgets: {
    type: "object",
    label: "Widgets",
    description: "A data structure containing the data for all the modules for this page",
    optional: true,
  },
};
