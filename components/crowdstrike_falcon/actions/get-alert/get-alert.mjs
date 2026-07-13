import { ConfigurationError } from "@pipedream/platform";
import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import {
  GET_ALERT_ID_BODY_FIELD,
  MAX_IDS_PER_REQUEST_ALERTS,
} from "../../common/constants.mjs";

export default {
  key: "crowdstrike_falcon-get-alert",
  name: "Get Alert",
  description: `Retrieve full CrowdStrike Falcon alert records for one or more alert composite IDs via GET /alerts/entities/alerts/v1 (max ${MAX_IDS_PER_REQUEST_ALERTS} per request). Use **Search Alerts** to find alert IDs first. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/alerts/#postentitiesalertsv2).`,
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    alertIds: {
      type: "string[]",
      label: "Alert IDs",
      description: `Alert composite IDs to retrieve (max ${MAX_IDS_PER_REQUEST_ALERTS}). Run **Search Alerts** to obtain these IDs. Sent as \`${GET_ALERT_ID_BODY_FIELD}\` in the request body.`,
    },
    includeHidden: {
      type: "boolean",
      label: "Include Hidden",
      description: "Allows previously hidden alerts to be retrieved",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.alertIds.length > MAX_IDS_PER_REQUEST_ALERTS) {
      throw new ConfigurationError(`A maximum of ${MAX_IDS_PER_REQUEST_ALERTS} alert IDs can be requested at once (received ${this.alertIds.length}).`);
    }
    const response = await this.crowdstrikeFalcon.getAlerts({
      $,
      data: {
        [GET_ALERT_ID_BODY_FIELD]: this.alertIds,
        include_hidden: this.includeHidden,
      },
    });
    const alerts = response.resources ?? [];
    $.export("$summary", `Retrieved ${alerts?.length ?? 0} alert${alerts?.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
