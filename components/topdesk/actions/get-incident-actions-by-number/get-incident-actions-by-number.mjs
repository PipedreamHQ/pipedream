import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-incident-actions-by-number",
  name: "Get Incident Actions By Number",
  description: "Get incident actions by incident number. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/progress%20trail%20%2F%20actions%20%2F%20requests/getIncidentActionsByNumber)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    incidentNumber: {
      label: "Incident Number",
      description: "The number of the incident",
      propDefinition: [
        app,
        "incidentId",
        () => ({
          mapper: (incident) => ({
            label: incident.briefDescription
              ? `${incident.number} - ${incident.briefDescription}`
              : incident.number,
            value: incident.number,
          }),
        }),
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of actions to return",
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
      incidentNumber,
      maxResults,
      inlineImages,
      forceImagesAsData,
      nonApiAttachmentUrls,
    } = this;

    const results = [];

    const paginator = app.paginate({
      fn: app.getIncidentActionsByNumber,
      fnArgs: {
        $,
        number: incidentNumber,
        params: {
          inlineimages: inlineImages,
          force_images_as_data: forceImagesAsData,
          non_api_attachment_urls: nonApiAttachmentUrls,
        },
      },
      maxResults,
    });

    for await (const action of paginator) {
      results.push(action);
    }

    $.export("$summary", `Successfully retrieved ${results.length} action(s) for incident number \`${incidentNumber}\``);

    return results;
  },
};
