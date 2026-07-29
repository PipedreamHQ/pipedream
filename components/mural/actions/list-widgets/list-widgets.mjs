import mural from "../../mural.app.mjs";

export default {
  key: "mural-list-widgets",
  name: "List Widgets",
  description: "List widgets in a mural. [See the documentation](https://developers.mural.co/public/reference/getmuralwidgets)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    muralId: {
      propDefinition: [
        mural,
        "muralId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    type: {
      type: "string[]",
      label: "Widget Types",
      description: "Filter by widget types, passed as an array such as `[\"sticky notes\", \"images\"]`. When not specified, returns all widget types.",
      options: [
        "sticky notes",
        "textbox",
        "shapes",
        "images",
        "areas",
        "arrows",
        "connectors",
        "files",
        "tables",
      ],
      optional: true,
    },
    parentId: {
      propDefinition: [
        mural,
        "widgetId",
        (c) => ({
          muralId: c.muralId,
          type: "areas",
        }),
      ],
      label: "Parent ID",
      description: "Return only widgets contained in this area. Must be the `id` of an area widget, as returned by this action when filtering on the `areas` type",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        mural,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.type?.length) {
      params.type = this.type;
    }
    if (this.parentId) {
      params.parentId = this.parentId;
    }

    const widgets = await this.mural.getPaginatedResults({
      fn: this.mural.listWidgets,
      args: {
        $,
        muralId: this.muralId,
        params,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${widgets.length} widget${widgets.length === 1
      ? ""
      : "s"}`);
    return widgets;
  },
};
