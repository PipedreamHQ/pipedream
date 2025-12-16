import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";
import commonPageProp from "../common/common-page-prop.mjs";

export default {
  key: "hubspot-create-page",
  name: "Create Page",
  description:
    "Create a page in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Fsite-pages)",
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
    ...commonPageProp,
  },
  async run({ $ }) {
    const response = await this.hubspot.createPage({
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
        name: this.pageName,
        layoutSections: parseObject(this.layoutSections),
        footerHtml: this.footerHtml,
        headHtml: this.headHtml,
        templatePath: this.templatePath,
        widgetContainers: parseObject(this.widgetContainers),
        widgets: parseObject(this.widgets),
      },
    });

    $.export("$summary", `Successfully created page with ID: ${response.id}`);

    return response;
  },
};
