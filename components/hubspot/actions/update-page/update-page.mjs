import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";
import commonPageProp from "../common/common-page-prop.mjs";

export default {
  key: "hubspot-update-page",
  name: "Update Page",
  description:
    "Update a page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#patch-%2Fcms%2Fv3%2Fpages%2Fsite-pages%2F%7Bobjectid%7D)",
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
        "pageId",
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
    ...commonPageProp,
  },
  async run({ $ }) {
    const response = await this.hubspot.updatePage({
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
        name: this.pageName,
        layoutSections: parseObject(this.layoutSections),
        footerHtml: this.footerHtml,
        headHtml: this.headHtml,
        templatePath: this.templatePath,
        widgetContainers: parseObject(this.widgetContainers),
        widgets: parseObject(this.widgets),
      },
    });

    $.export("$summary", `Successfully updated page with ID: ${response.id}`);

    return response;
  },
};
