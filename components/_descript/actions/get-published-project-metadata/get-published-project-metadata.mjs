import _descript from "../../_descript.app.mjs";

export default {
  key: "_descript-get-published-project-metadata",
  name: "Get Published Project Metadata",
  description: "Get the metadata for a published project. [See the documentation](https://docs.descriptapi.com/#tag/Export-from-Descript/operation/getPublishedProjectMetadata)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    _descript,
  },
  async run({ $ }) {
    const response = await this._descript.getPublishedProjectMetadata({
      $,
    });
    $.export("$summary", `Successfully retrieved metadata for published project ${this._descript.$auth.published_project_slug}`);
    return response;
  },
};
