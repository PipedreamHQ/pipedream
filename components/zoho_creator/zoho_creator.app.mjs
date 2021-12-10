import { axios } from "@pipedream/platform";
import dateFormat from "dateformat";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "zoho_creator",
  propDefinitions: {
    appLinkName: {
      type: "string",
      label: "Application",
      description: "The link name of the target application",
      async options() {
        const { applications = [] } = await this.getApplications();
        return applications.map((application) => ({
          label: application.application_name,
          value: application.link_name,
        }));
      },
    },
    reportLinkName: {
      type: "string",
      label: "Report",
      description: "The link name of the target report",
      async options({ appLinkName }) {
        const { reports = [] } = await this.getReports({
          appLinkName,
        });
        return reports.map((report) => ({
          label: report.display_name,
          value: report.link_name,
        }));
      },
    },
  },
  methods: {
    getAccount() {
      return this.$auth.oauth_uid;
    },
    async makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        params: customParams,
        ...additionalConfig
      } = customConfig;

      const {
        base_api_uri: baseApiUri,
        oauth_access_token: oauthAccessToken,
      } = this.$auth;

      const authorization = `${constants.TOKEN_PREFIX} ${oauthAccessToken}`;
      const headers = {
        authorization,
        ...constants.DEFAULT_HEADERS,
      };

      const builtUrl = `${constants.BASE_PREFIX_URL}${baseApiUri}${constants.VERSION_PATH}${path}`;

      const params = url
        ? undefined
        : customParams;

      const config = {
        ...additionalConfig,
        headers,
        url: url || builtUrl,
        params,
      };

      return await axios($ || this, config);
    },
    async getApplications($) {
      return this.makeRequest({
        $,
        path: "/applications",
      });
    },
    async getReports({
      $, appLinkName, params,
    }) {
      return this.makeRequest({
        $,
        path: `/${this.getAccount()}/${appLinkName}/reports`,
        params,
      });
    },
    async getRecords({
      $, appLinkName, reportLinkName, afterAddedTime, afterModifiedTime, params,
    }) {
      const criteria = [
        afterAddedTime && `${constants.ADDED_TIME_FIELD} > '${afterAddedTime}'`,
        afterModifiedTime && `${constants.MODIFIED_TIME_FIELD} > '${afterModifiedTime}'`,
      ].reduce(
        (reduction, criteria) =>
          (criteria && reduction.concat(criteria) || reduction),
        [],
      ).join("&&") || undefined;

      return this.makeRequest({
        $,
        path: `/${this.getAccount()}/${appLinkName}/report/${reportLinkName}`,
        params: {
          ...params,
          criteria,
        },
      });
    },
    /**
     * This function should always be called with `from` property set to `1`
     * Because if someone decides to remove records from Zoho Creator UI,
     * then the call should start again to count the records from the last record created as index 1
     * @param {Object} args - arguments object
     * @param {string} args.appLinkName - application link name
     * @param {string} args.reportLinkName - report link name
     * @param {number} args.max - maximum number of records to fetch
     * @param {number} args.from - 1 index based query string parameter
     * @param {number} args.limit - query string parameter for limit the records by page
     * @param {string} args.afterAddedTime
     * - string criteria to filter records after added time
     * @param {string} args.afterModifiedTime
     * - string criteria to filter records after modified time
     * @returns {Array} Array of records
     */
    async *getRecordsStream({
      appLinkName,
      reportLinkName,
      max,
      from = 1,
      limit = constants.DEFAULT_PAGE_LIMIT,
      afterAddedTime,
      afterModifiedTime,
    } = {}) {
      let recordsCounter = 0;

      while (true) {
        const { data: records } =
          await this.getRecords({
            appLinkName,
            reportLinkName,
            afterAddedTime,
            afterModifiedTime,
            params: {
              from,
              limit,
            },
          });

        if (!records || records.length === 0) {
          return;
        }

        for (const record of records) {
          yield record;

          recordsCounter += 1;

          if (max && recordsCounter >= max) {
            return;
          }
        }

        from += limit;
      }
    },
    /**
     * Return the "date" portion of a Date object representing a date a number of days prior to the
     * current date as a string in an application's [date format]{@link https://bit.ly/3IAvcjW}
     *
     * @param {String} appLinkName - the application link name
     * @param {Number} days - the number of days ago
     * @returns {String} a string representation of the prior date
     */
    async daysAgoString({
      appLinkName, days,
    }) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      const { applications = [] } = await this.getApplications();
      const application = applications.find((app) => app.link_name === appLinkName);

      if (!application) {
        return daysAgo.toDateString();
      }

      // Convert Zoho Creator mask to "dateformat" mask
      const format = application.date_format.replace("E", "ddd").toLowerCase();
      return dateFormat(daysAgo, format);
    },
  },
};
