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
      description:
                "Claim details passed as a string in the format \"claimId-passwordPluginId-password\"",
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
    validateProps() {
      const details = this.claimInfo.split("-");
      if (details.length !== 3 || !details.every((part) => part.trim())) {
        throw new Error(
          "Invalid claim details: each part must be non-empty",
        );
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(this.address)) {
        throw new Error("Invalid address format");
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(this.claimInfo)) {
        throw new Error("Invalid claim info format");
      }
    },
  },

  async run({ $ }) {
    const details = this.claimInfo.split("-");

    // Sanitize and validate each part
    const [
      claimId,
      passwordPluginId,
      password,
    ] = details.map((part) =>
      part.trim());
    if (!/^[a-zA-Z0-9-_]+$/.test(claimId)) {
      throw new Error("Invalid claim ID format");
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(passwordPluginId)) {
      throw new Error("Invalid password plugin ID format");
    }

    const baseUrl = "https://api.bitbadges.io/api/v0/claims";
    const action = this.isSimulation
      ? "simulate"
      : "complete";
    const endpoint = new URL(
      `${action}/${encodeURIComponent(claimId)}/${encodeURIComponent(this.address)}`,
      baseUrl,
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
      // Validate response structure
      if (!response?.claimAttemptId) {
        throw new Error("Invalid response: missing claimAttemptId");
      }
      const result = {
        success: true,
        claimAttemptId: response.claimAttemptId,
        currentTimestamp: Date.now(),
      };
      return result;
    } catch (error) {
      // Sanitize error message
      const safeMessage = "Failed to complete claim. Please try again later.";
      throw new Error(safeMessage);
    }
  },
};
