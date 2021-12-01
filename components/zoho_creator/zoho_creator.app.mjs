import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "zoho_creator",
  propDefinitions: {},
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
      $, appLinkName, reportLinkName, params,
    }) {
      return this.makeRequest({
        $,
        path: `/${this.getAccount()}/${appLinkName}/report/${reportLinkName}`,
        params,
      });
    },
    async getApplicationsReports() {
      const { applications = [] } = await this.getApplications();

      const deferredPromises =
        applications
          .map(async ({ link_name: appLinkName }) => ([
            appLinkName,
            await this.getReports({
              appLinkName,
            }),
          ]));

      const applicationReports = await Promise.all(deferredPromises);

      // Reports flatten
      return applicationReports
        .reduce((reduction, [
          appLinkName,
          { reports = [] },
        ]) => {
          const appReports =
            reports.map((report) => ({
              ...report,
              appLinkName,
            }));
          return reduction.concat(appReports);
        }, []);
    },
    /**
     * This function should always be called with `from` property set to `1`
     * Because if someone decides to remove records from Zoho Creator UI,
     * then the call should start again to count the records from the last record created as index 1
     * @param {object} arguments - arguments object
     * @param {string} arguments.appLinkName - application link name
     * @param {string} arguments.reportLinkName - report link name
     * @param {number} arguments.from - 1 index based query string parameter
     * @param {number} arguments.limit - query string parameter for limit the records by page
     * @returns {Array} Array of records
     */
    async paginateRecords({
      appLinkName, reportLinkName, from = 1, limit = constants.DEFAULT_PAGE_LIMIT,
    } = {}) {
      let records = [];
      let nextRecords = [];

      do {
        try {
          ({ data: nextRecords } =
            await this.getRecords({
              appLinkName,
              reportLinkName,
              params: {
                from,
                limit,
              },
            }));

          // Reverse order to make sure the last record is the first record
          // in the UI to show up as an event. Sorting from the API was not found.
          records = nextRecords.reverse().concat(records);

          from += limit;

        } catch (error) {
          const { response } = error;

          if (response.status !== constants.HTTP_STATUS_NOT_FOUND) {
            throw error;
          }

          nextRecords = [];
        }

      } while (nextRecords.length === limit);

      return records;
    },
  },
};
