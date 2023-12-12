import admin from "@googleapis/admin";
import { defineApp } from "@pipedream/types";
import constants from "../common/constants";
import utils from "../common/utils";

export default defineApp({
  type: "app",
  app: "google_workspace",
  propDefinitions: {
    applicationName: {
      type: "string",
      label: "Application Name",
      description: "Application name for which the events are to be retrieved.",
      options: constants.APPLICATION_NAME_OPTIONS,
    },
    userKey: {
      type: "string",
      label: "User Key",
      description: "Represents the profile ID or the user email for which the data should be filtered. Unique Google Workspace profile ID or their primary email address. Must not be a deleted user. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#path-parameters)",
      async options({ prevContext }) {
        const { pageToken } = prevContext;
        const {
          users,
          nextPageToken,
        } =
          await this.listUsers({
            pageToken,
          });
        const options =
          users?.map(({
            name: label, primaryEmail: value,
          }) => ({
            label,
            value,
          }));
        return {
          options,
          context: {
            pageToken: nextPageToken,
          },
        };
      },
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event being queried by the API. Each **Event Name** is related to a specific Google Workspace service or feature which the API organizes into types of events. An example is the Google Calendar events in the Admin console application's reports. The Calendar Settings type structure has all of the Calendar **Event Name** activities reported by the API. When an administrator changes a Calendar setting, the API reports this activity in the Calendar Settings type and **Event Name** parameters. For more information about **Event Name** query strings and parameters, see the list of event names for various applications above in **Application Name**. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#query-parameters)",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Sets the end of the range of time shown in the report. The date is in the [RFC 3339 format](http://www.ietf.org/rfc/rfc3339.txt), for example `2010-10-28T10:26:35.000Z`. The default value is the approximate time of the API request. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#query-parameters)",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Sets the beginning of the range of time shown in the report. The date is in the [RFC 3339 format](http://www.ietf.org/rfc/rfc3339.txt), for example `2010-10-28T10:26:35.000Z`. The report returns all activities from **Start Time** until **End Time**. The **Start Time** must be before the **End Time** (if specified) and the current time when the request is made, or the API returns an error. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#query-parameters)",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Determines how many activity records are shown on each response page. For example, if the request sets `maxResults=1` and the report has two activities, the report has two pages. The response's `nextPageToken` property has the token to the second page. The **Max Results** query string is optional in the request. The default value is `1000`. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#query-parameters)",
      optional: true,
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "The filters query string is a comma-separated list composed of event parameters manipulated by relational operators. Event parameters are in the form `{parameter1 name}{relational operator}{parameter1 value},{parameter2 name}{relational operator}{parameter2 value},....`. For more details on this parameter see the [docs here](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list#query-parameters)",
      optional: true,
    },
  },
  methods: {
    admin() {
      const auth = new admin.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return admin.admin({
        version: "reports_v1",
        auth,
      });
    },
    users() {
      const auth = new admin.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return admin.admin({
        version: "directory_v1",
        auth,
      });
    },
    async listAdminActivities(args = {}) {
      try {
        const admin = this.admin();
        const { data } = await admin.activities.list(args);
        return data;
      } catch (error) {
        console.log("Error in listAdminActivities", utils.stringifyError(error));
        throw error;
      }
    },
    async watchAdminActivities(args) {
      try {
        const admin = this.admin();
        const { data } = await admin.activities.watch(args);
        return data;
      } catch (error) {
        console.log("Error in watchAdminActivities", utils.stringifyError(error));
        throw error;
      }
    },
    async stopAdminActivities(args) {
      try {
        const admin = this.admin();
        return await admin.channels.stop(args);
      } catch (error) {
        console.log("Error in stopAdminActivities", utils.stringifyError(error));
        throw error;
      }
    },
    async listUsers(args = {}) {
      try {
        const users = this.users();
        const { data } =
          await users.users.list(args);
        return data;
      } catch (error) {
        console.log("Error in listUsers", utils.stringifyError(error));
        throw error;
      }
    },
  },
});
