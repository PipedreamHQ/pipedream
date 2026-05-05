import tableau from "../../tableau.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "tableau-list-sites",
  name: "List Sites",
  description: "Returns a list of the sites on the server that the caller of this method has access to. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_site.htm#query_sites)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tableau,
    info: {
      type: "alert",
      alertType: "info",
      content: "Listing all sites requires Server Administrator Permissions. If you don't have these permissions, the action will return the site from the current session.",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of sites to return per page. The default is 100. Maximum is 1000. Only used for calls with Server Administrator Permissions.",
      optional: true,
      default: 100,
      min: 1,
      max: 1000,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number to return. The default is 1. Only used for calls with Server Administrator Permissions.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    let response;
    try {
      response = await this.tableau.listSites({
        $,
        params: {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
        },
      });
    } catch (error) {
      if (error?.message?.includes("Invalid page number")) {
        throw new ConfigurationError("Page number invalid.");
      }
      // User lacks permission to list sites. Return the site from the current session.
      const { session: { site } } = await this.tableau.getCurrentSession({
        $,
      });
      response = {
        sites: {
          site: [
            site,
          ],
        },
      };
    }
    $.export("$summary", `Successfully listed ${response.sites.site.length} site${response.sites.site.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
