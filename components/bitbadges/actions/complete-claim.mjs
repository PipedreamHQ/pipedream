import app from "../bitbadges.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "complete-claim",
  name: "Complete Claim",
  description: "Completes a BitBadges claim on behalf of a user.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    claimInfo: {
      type: "string",
      label: "Claim Info",
      description: "Claim details passed as a string in the format \"claimId-passwordPluginId-password\"",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the user",
    },
    isSimulation: {
      type: "boolean",
      label: "Is Simulation",
      description: "Boolean to determine if this is a simulated run",
      default: false,
    },
  },
  async run({ $ }) {
    const details = this.claimInfo.split("-");
    if (details.length !== 3) {
      throw new Error("Invalid claim details parsed");
    }

    const claimId = details[0];
    const passwordPluginId = details[1];
    const password = details[2];

    const baseUrl = "https://api.bitbadges.io/api/v0/claims";
    const action = this.isSimulation ? "simulate" : "complete";
    const endpoint = new URL(
      `${action}/${encodeURIComponent(claimId)}/${encodeURIComponent(this.address)}`,
      baseUrl
    ).toString();

    const data = {
      _expectedVersion: -1,
      [`${passwordPluginId}`]: {
        password: password,
      },
    };

    try {
      const response = await axios($, {
        method: "post",
        url: endpoint,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-api-key": `${this.bitbadges.$auth.api_key}`,
        },
        data,
      });

      const result = response;

      // Note: This means a successful trigger (add to queue), not a claim completion
      // You can use the claimAttemptId to poll
      return {
        success: true,
        claimAttemptId: result.claimAttemptId || "",
        currentTimestamp: Date.now(),
      };
    } catch (error) {
      throw new Error(`Failed to complete claim: ${error.message}`);
    }
  },
};
