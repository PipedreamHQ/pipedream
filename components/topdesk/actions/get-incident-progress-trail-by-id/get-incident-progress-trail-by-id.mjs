import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-incident-progress-trail-by-id",
  name: "Get Incident Progress Trail By ID",
  description: "Get incident progress trail by incident ID. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/progress%20trail%20%2F%20actions%20%2F%20requests/getIncidentProgressTrailById)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    incidentId: {
      propDefinition: [
        app,
        "incidentId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of progress trail entries to return",
      optional: true,
    },
    inlineImages: {
      propDefinition: [
        app,
        "inlineImages",
      ],
    },
    forceImagesAsData: {
      propDefinition: [
        app,
        "forceImagesAsData",
      ],
    },
    nonApiAttachmentUrls: {
      propDefinition: [
        app,
        "nonApiAttachmentUrls",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      incidentId,
      maxResults,
      inlineImages,
      forceImagesAsData,
      nonApiAttachmentUrls,
    } = this;

    const results = [];

    const paginator = app.paginate({
      fn: app.getIncidentProgressTrailById,
      fnArgs: {
        $,
        incidentId,
        params: {
          inlineimages: inlineImages,
          force_images_as_data: forceImagesAsData,
          non_api_attachment_urls: nonApiAttachmentUrls,
        },
      },
      maxResults,
    });

    for await (const entry of paginator) {
      results.push(entry);
    }

    $.export("$summary", `Successfully retrieved ${results.length} progress trail entr${results.length === 1
      ? "y"
      : "ies"} for incident ID \`${incidentId}\``);

    return results;
  },
};
