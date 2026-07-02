import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-list-property-types",
  name: "List Property Types",
  description: "Returns a list of all available property types. [See the documentation](https://dev.easybroker.com/reference/get_property-types)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easybroker,
    locale: {
      type: "string",
      label: "Locale",
      description: "The language for the returned property type names. Defaults to your organization's language",
      options: [
        "en",
        "es",
        "pt",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of property types to return per page. Maximum: `100`",
      optional: true,
      max: 100,
      default: 20,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    const response = await this.easybroker.listPropertyTypes({
      $,
      params: {
        locale: this.locale,
        limit: this.limit,
        page: this.page,
      },
    });
    $.export("$summary", `Successfully listed ${response?.content?.length} property type${response?.content?.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
