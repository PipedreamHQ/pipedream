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
      description: "Filter by widget types. When not specified, returns all widget types.",
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
      description: "Filter widgets by the ID of the parent area widget",
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
