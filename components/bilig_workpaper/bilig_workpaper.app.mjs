import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "bilig_workpaper",
  propDefinitions: {
    forecastSheetName: {
      type: "string",
      label: "Sheet Name",
      description: "Forecast input sheet to edit. Example: `Inputs`.",
      default: "Inputs",
    },
    forecastCell: {
      type: "string",
      label: "Cell",
      description: "Editable forecast input cell.",
      options: [
        {
          label: "B2 Qualified Opportunities",
          value: "B2",
        },
        {
          label: "B3 Win Rate",
          value: "B3",
        },
        {
          label: "B4 Average ARR",
          value: "B4",
        },
        {
          label: "B5 Expansion Multiplier",
          value: "B5",
        },
      ],
      default: "B3",
    },
    forecastValue: {
      type: "integer",
      label: "Value",
      description: "Numeric value to write before formula readback.",
      default: 40,
    },
    forecastValueDivisor: {
      type: "integer",
      label: "Value Divisor",
      description: "Divide Value by this number before sending. Use 100 for percentages like 40 -> 0.4.",
      default: 100,
      min: 1,
    },
  },
  methods: {
    /**
     * Returns the connected account's Bilig base URL.
     *
     * @returns {string} Base URL without trailing slashes.
     */
    _baseUrl() {
      const baseUrl = this.$auth?.base_url;

      if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
        throw new ConfigurationError("Bilig Base URL is required in the connected account.");
      }

      return baseUrl.trim().replace(/\/+$/, "");
    },

    /**
     * Makes an HTTP request to a Bilig WorkPaper endpoint.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.path - API path to request.
     * @returns {Promise<object>} Bilig API response.
     */
    _makeRequest({
      $,
      path,
      ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        url: path,
        ...args,
      });
    },

    /**
     * Writes one forecast input and verifies formula readback proof.
     *
     * @param {object} args - Verification arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.sheetName - Sheet containing the input cell.
     * @param {string} args.address - A1-style input cell address.
     * @param {number} args.value - Numeric value to write.
     * @returns {Promise<object>} Verified Bilig WorkPaper proof response.
     */
    async verifyForecastReadback({
      $,
      sheetName,
      address,
      value,
    }) {
      const response = await this._makeRequest({
        $,
        path: "/api/workpaper/n8n/forecast",
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        data: {
          sheetName,
          address,
          value,
        },
      });

      if (response?.verified !== true) {
        throw new Error("Bilig did not return verified formula readback proof.");
      }

      const checks = response.checks ?? {};
      const requiredChecks = [
        "formulasPersisted",
        "restoredMatchesAfter",
        "computedOutputChanged",
      ];
      const missingChecks = requiredChecks.filter((key) => checks[key] !== true);

      if (missingChecks.length > 0) {
        throw new Error(`Bilig formula proof failed checks: ${missingChecks.join(", ")}.`);
      }

      return response;
    },
  },
};
