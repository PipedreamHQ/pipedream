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
      const storeFields = {
        address: this.address,
        id: this.id,
        email: this.email,
        username: this.username,
      };

      const providedFields = Object.entries(storeFields)
        .filter(([
          ,
          value,
        ]) => value !== undefined);

      if (providedFields.length === 0) {
        throw new Error("At least one store-specific field (address, id, email, or username) must be provided");
      }

      // Add email format validation
      if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        throw new Error("Invalid email format");
      }

      return true;
    },
  },

  async run({ $ }) {
    const details = this.claimInfo.split("-");
    if (details.length !== 3 || !details.every((part) => part.trim())) {
      throw new Error(
        "Invalid claim details: each part must be non-empty",
      );
    }

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
