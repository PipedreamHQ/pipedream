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
    async paginateRecords({
      appLinkName, reportLinkName, page = 0,
    } = {}) {
      let records = [];

      do {
        try {
          const { data: nextRecords } =
            await this.getRecords({
              appLinkName,
              reportLinkName,
              params: {
                from: page,
              },
            });

          records = records.concat(nextRecords);
          console.log("records", records);

          page += 1;

        } catch (error) {
          const { response } = error;

          if (response.status !== 404) {
            throw error;
          }

          records = [];
        }

      } while (records.length);

      return records;
    },
  },
};
