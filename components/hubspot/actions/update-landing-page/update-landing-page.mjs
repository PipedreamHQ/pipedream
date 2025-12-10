import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";
import commonPageProp from "../common/common-page-prop.mjs";

export default {
  key: "hubspot-update-landing-page",
  name: "Update Landing Page",
  description:
    "Update a landing page in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#patch-%2Fcms%2Fv3%2Fpages%2Flanding-pages%2F%7Bobjectid%7D)",
  version: "0.0.10",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    pageId: {
      propDefinition: [
        hubspot,
        "landingPageId",
      ],
      description: "The ID of the page to update.",
    },
    pageName: {
      propDefinition: [
        hubspot,
        "pageName",
      ],
      optional: true,
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
    const response = await this.hubspot.updateLandingPage({
      $,
      pageId: this.pageId,
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
      `Successfully updated landing page with ID: ${response.id}`,
    );

    return response;
  },
};
