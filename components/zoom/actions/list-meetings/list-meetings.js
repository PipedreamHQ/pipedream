const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
  key: "zoom-list-meetings",
  name: "List Meetings",
  description: "List all meetings",
  type: "action",
  version: "0.0.1",
  props: {
    zoom,
    userId: {
      label: "UserId",
      type: "string",
      description: "The user ID ",
      optional: false,
      default: ""
      // @todo use and async options to pull userId 
    },
    type: {
      label: "Type",
      type: "string",
      description: "The meeting types: <br>'scheduled' - This includes all valid past meetings (unexpired), live meetings and upcoming scheduled meetings. It is equivalent to the combined list of \"Previous Meetings\" and \"Upcoming Meetings\" displayed in the user's [Meetings page](https://zoom.us/meeting) on the Zoom Web Portal.<br>'live' - All the ongoing meetings.<br>'upcoming' - All upcoming meetings including live meetings.",
      optional: true,
      default: "live"
    },
    pageSize: {
      label: "Page size",
      type: "integer",
      description: "The number of records returned within a single API call.",
      optional: true,
      default: 30
    },
    nextPageToken: {
      label: "Next page token",
      type: "string",
      description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
      optional: true,
      default: ""
    },
    pageNumber: {
      label: "Page number",
      type: "integer",
      description: "The page number of the current page in the returned records.",
      optional: true,
      default: ""
    }
  },
  async run() {
    const queryParams = this.zoom.makeQueryParams({
      type: this.type,
      page_size: this.pageSize,
      next_page_token: this.nextPageToken,
      page_number: this.pageNumber
    });

    const requestConfig = this.zoom.makeRequestConfig(
      `/users/${this.userId}/meetings${queryParams}`,
      "get",
      ""
    );

    try {
      let response = await axios(this, requestConfig);
      return response;
    } catch (error) {
        return error.response.data;
    }
  }
}