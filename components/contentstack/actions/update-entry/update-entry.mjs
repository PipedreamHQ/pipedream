import common from "../common/entries.mjs";

export default {
  ...common,
  key: "contentstack-update-entry",
  name: "Update Entry",
  description: "Updates an existing Contentstack entry. [See the documentation](https://www.contentstack.com/docs/developers/apis/content-management-api#update-an-entry).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    entryId: {
      propDefinition: [
        common.props.contentstack,
        "entryId",
        (c) => ({
          contentType: c.contentType,
        }),
      ],
    },
    locale: {
      propDefinition: [
        common.props.contentstack,
        "locale",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    isUpdate() {
      return true;
    },
  },
  async run({ $ }) {
    const response = await this.contentstack.updateEntry({
      $,
      contentType: this.contentType,
      entryId: this.entryId,
      params: {
        locale: this.locale,
      },
      data: {
        entry: await this.buildEntry(),
      },
    });
    $.export("$summary", `Entry ${this.entryId} updated successfully`);
    return response;
  },
};
