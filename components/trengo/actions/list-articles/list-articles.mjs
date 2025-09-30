import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-list-articles",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Articles",
  description: "List articles from a help center according to the specified criteria. [See the documentation](https://developers.trengo.com/reference/list-all-articles)",
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    localeCode: {
      type: "string",
      label: "Locale Code",
      description: "The article's locale code",
      optional: true,
      default: "en",
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "The article's filter. You can choose one of the available options, specify `untranslated_<language_code>` for other language codes, or leave empty for all articles",
      optional: true,
      options: [
        "draft",
        "published",
        "untranslated_en",
      ],
    },
    term: {
      type: "string",
      label: "Search Term",
      description: "The article's search term (if not specified, all articles will be returned)",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of articles to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const articles = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getArticles,
      resourceFnArgs: {
        helpCenterId: this.helpCenterId,
        params: {
          localeCode: this.localeCode,
          filter: this.filter,
          term: this.term,
        },
      },
    });
    for await (const item of resourcesStream) {
      articles.push(item);
      if (this.maxResults && articles.length >= this.maxResults) {
        break;
      }
    }
    const length = articles.length;
    $.export("$summary", `Successfully retrieved ${length} article${length === 1
      ? ""
      : "s"}`);
    return articles;
  },
};
