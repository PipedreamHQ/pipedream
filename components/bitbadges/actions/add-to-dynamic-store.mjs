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
    dynamicDataId: {
      type: "string",
      label: "Dynamic Data ID",
      description: "The dynamic data store ID to add to.",
      optional: false,
    },
    dataSecret: {
      type: "string",
      label: "Data Secret",
      description: "The data secret of the dynamic data store.",
      optional: false,
    },
    address: {
      type: "string",
      label: "Address",
      description:
                "The address to add to the dynamic data store. Only applicable if it is an address store.",
      optional: true,
    },
    id: {
      type: "string",
      label: "ID",
      description:
                "The ID to add to the dynamic data store. Only applicable if it is a socials store.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description:
                "The email to add to the dynamic data store. Only applicable if it is an email store.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description:
                "The username to add to the dynamic data store. Only applicable if it is a socials store.",
      optional: true,
    },
    validateProps() {
      // Validate email format if provided
      if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        throw new Error("Invalid email format");
      }

      // Validate blockchain address
      if (this.address && !/^[a-zA-Z0-9-_]+$/.test(this.address)) {
        throw new Error("Invalid blockchain address format");
      }

      // Validate ID format if provided
      if (this.id && !/^[a-zA-Z0-9-_]+$/.test(this.id)) {
        throw new Error("Invalid ID format");
      }

      // Validate username format if provided
      if (this.username && !/^[a-zA-Z0-9-_]+$/.test(this.username)) {
        throw new Error("Invalid username format");
      }

      const storeFields = {
        address: this.address,
        id: this.id,
        email: this.email,
        username: this.username,
      };

      if (!Object.values(storeFields).some((value) => value !== undefined)) {
        throw new Error("At least one store-specific field must be provided");
      }

      return true;
    },
  },
  async run({ $ }) {
    try {
      // Validate that at least one store-specific field is provided
      const storeFields = {
        address: this.address,
        id: this.id,
        email: this.email,
        username: this.username,
      };

      // Filter out undefined values from payload
      const data = Object.entries(storeFields)
        .reduce((acc, [
          key,
          value,
        ]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});

      const endpoint = new URL(
        `bin-actions/add/${encodeURIComponent(this.dynamicDataId)}/${encodeURIComponent(this.dataSecret)}`,
        "https://api.bitbadges.io/api/v0/",
      ).toString();

      await axios($, {
        method: "POST",
        url: endpoint,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-api-key": this.bitbadges.$auth.api_key,
        },
        data,
      });

      // Validate successful response
      const result = {
        success: true,
        timestamp: Date.now(),
      };
      $.export("result", result);
      return {
        success: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      // Sanitize and structure error information
      const errorInfo = {
        message: "Failed to add to dynamic store. Please try again later.",
        code: error.response?.status,
        timestamp: Date.now(),
      };
      $.export("error", errorInfo);
      throw new Error(errorInfo.message);
    }
  },
};
