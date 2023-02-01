import statuspage from "../../statuspage.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Update Incident",
  version: "0.0.1",
  key: "statuspage-update-incident",
  description: "Updates an existing incident. [See docs here](https://developer.statuspage.io/#update-an-incident)",
  type: "action",
  props: {
    statuspage,
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    incidentId: {
      propDefinition: [
        statuspage,
        "incidentId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
    },
    status: {
      label: "Status",
      description: "The new status of the incident (e.g. `resolved`, `investigating`)",
      type: "string",
      options: constants.INCIDENT_STATUSES,
    },
    body: {
      label: "Body",
      description: "The body of the update",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.statuspage.updateIncident({
      $,
      pageId: this.pageId,
      incidentId: this.incidentId,
      data: {
        incident: {
          status: this.status,
          body: this.body,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated incident with id ${response.id}`);
    }

    return response;
  },
};
