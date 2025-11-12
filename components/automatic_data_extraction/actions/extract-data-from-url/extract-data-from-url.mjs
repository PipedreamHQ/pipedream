import automaticDataExtraction from "../../automatic_data_extraction.app.mjs";
import { PAGE_TYPES } from "../../common/constants.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "automatic_data_extraction-extract-data-from-url",
  name: "Extract Data From URL",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Extract data from a specified URL [See the docs here](https://docs.zyte.com/automatic-extraction-integrations.html#node-js)",
  type: "action",
  props: {
    automaticDataExtraction,
    url: {
      type: "string",
      label: "URL",
      description: "URL of web page to extract from. Must be a valid `http://` or `https:// URL`.",
    },
    pageType: {
      type: "string",
      label: "Page Type",
      description: "Type of extraction to perform.",
      options: PAGE_TYPES,
    },
    meta: {
      type: "string",
      label: "Meta",
      description: "User UTF-8 string, which will be passed through the extraction pipeline and returned in the query result. Max size 4 Kb.",
      optional: true,
    },
    articleBodyRaw: {
      type: "boolean",
      label: "Article Body Raw",
      description: "Whether or not to include article HTML in article extractions. True by default. Setting this to false can reduce response size significantly if HTML is not required.",
      optional: true,
    },
    fullHtml: {
      type: "boolean",
      label: "Full HTML",
      description: "Include the full, raw HTML of the target web page in the query result. This is a premium feature that is disabled by default. [Open a support ticket](https://support.zyte.com/support/tickets/new) if you wish to have it enabled for your account.",
      optional: true,
    },
    customHtml: {
      type: "string",
      label: "Custom HTML",
      description: "HTML source to be scraped. Extraction will be done from the provided HTML with additional resources (images, CSS, etc.) downloaded from the provided url. JavaScript processing will be disabled. The String should be UTF-8 encoded. The maximum length is 2,000,000 characters, longer requests will be rejected.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      automaticDataExtraction,
      ...data
    } = this;

    const response = await automaticDataExtraction.extractData({
      $,
      data: JSON.stringify([
        clearObj(data),
      ]),
    });

    $.export("$summary", "The data was successfully extracted!");
    return response;
  },
};
