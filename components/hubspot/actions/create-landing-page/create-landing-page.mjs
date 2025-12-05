import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";
import commonPageProp from "../common/common-page-prop.mjs";

export default {
  key: "hubspot-create-landing-page",
  name: "Create Landing Page",
  description:
    "Create a landing page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Flanding-pages)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    pageName: {
      propDefinition: [
        hubspot,
        "pageName",
      ],
    },
    landingFolderId: {
      propDefinition: [
        hubspot,
        "landingFolderId",
      ],
      optional: true,
    },
    ...commonPageProp,
  },
  async run({ $ }) {
    const response = await this.hubspot.createLandingPage({
      $,
      data: {
        language: this.language,
        enableLayoutStylesheets: this.enableLayoutStylesheets,
        metaDescription: this.metaDescription,
        attachedStylesheets: parseObject(this.attachedStylesheets),
        password: this.password,
        publishImmediately: this.publishImmediately,
        htmlTitle: this.htmlTitle,
        translations: parseObject(this.translations),
        folderId: this.landingFolderId,
        name: this.pageName,
        layoutSections: parseObject(this.layoutSections),
        footerHtml: this.footerHtml,
        headHtml: this.headHtml,
        templatePath: this.templatePath,
        widgetContainers: parseObject(this.widgetContainers),
        widgets: parseObject(this.widgets),
      },
    });

    $.export(
      "$summary",
      `Successfully created landing page with ID: ${response.id}`,
    );

    return response;
  },
};
