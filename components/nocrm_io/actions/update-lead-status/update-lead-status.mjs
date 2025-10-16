import nocrm_io from "../../nocrm_io.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Update Lead Status",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "nocrm_io-update-lead-status",
  description: "Updates a lead status. [See docs here](https://www.nocrm.io/api#leads)",
  type: "action",
  props: {
    nocrm_io,
    leadId: {
      propDefinition: [
        nocrm_io,
        "leadId",
      ],
    },
    status: {
      label: "Status",
      description: "Lead's status. The new status of the lead.",
      type: "string",
      options: constants.LEAD_STATUSES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const additionalProps = {};

    if (this.status === "standby") {
      additionalProps["remindDate"] = {
        label: "Status",
        description: "Date of the reminder with the format YYYY-MM-DD. E.g. `2022-08-18`",
        type: "string",
      };
    }

    return additionalProps;
  },
  async run({ $ }) {
    const response = await this.nocrm_io.updateLead({
      $,
      leadId: this.leadId,
      data: {
        status: this.status,
        remind_date: this.remindDate,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated lead with id ${response.id}`);
    }

    return response;
  },
};
