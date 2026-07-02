import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListLocationsParams } from "../../common/requestParams";
import { Location } from "../../common/responseSchemas";

const DOCS_LINK = "https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list";

export default defineAction({
  key: "google_my_business-list-locations",
  name: "List Locations",
  description: `Lists the locations for the specified account. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    readMask: {
      type: "string",
      label: "Read Mask",
      description: "A comma-separated list of fields to return for each location (e.g. `name,title,categories,storefrontAddress`). Defaults to `name,title` if omitted.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "A filter constraining the locations to return. [See the documentation](https://developers.google.com/my-business/content/location-data#filter_results_when_you_list_locations) for supported filter syntax.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Sorting order for the request. Multiple fields should be comma-separated, following SQL syntax. The default sorting order is ascending. To specify descending order, a suffix \" desc\" should be added. Valid fields to orderBy are title and storeCode. For example: \"title, storeCode desc\" or \"title\" or \"storeCode desc\"",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of locations to return per page.",
      min: 1,
      max: 100,
      default: 100,
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Token from a previous response to retrieve the next page of results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      account, readMask, filter, orderBy, pageSize, pageToken,
    } = this;

    const params: ListLocationsParams = {
      $,
      account,
      params: {
        readMask: readMask ?? "name,title",
        filter,
        orderBy,
        pageSize,
        pageToken,
      },
    };

    const response: { locations?: Location[]; nextPageToken?: string; totalSize?: number; } = await this.app.listLocations(params);
    const locations = response?.locations ?? [];

    $.export("$summary", `Successfully listed ${locations.length} location${locations.length !== 1
      ? "s"
      : ""}`);

    return response;
  },
});
