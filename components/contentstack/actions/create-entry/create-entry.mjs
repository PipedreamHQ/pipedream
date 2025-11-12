import common from "../common/entries.mjs";

export default {
  ...common,
  key: "contentstack-create-entry",
  name: "Create Entry",
  description: "Creates a new entry in Contentstack. [See the documentation](https://www.contentstack.com/docs/developers/apis/content-management-api#create-an-entry).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    locale: {
      propDefinition: [
        common.props.contentstack,
        "locale",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.contentstack.createEntry({
      $,
      contentType: this.contentType,
      params: {
        locale: this.locale,
      },
      data: {
        entry: await this.buildEntry(),
      },
    });
    $.export("$summary", `Created entry "${response.entry.title}" with UID ${response.entry.uid}`);
    return response;
  },
};
