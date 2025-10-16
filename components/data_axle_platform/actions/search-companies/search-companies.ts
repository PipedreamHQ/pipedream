import dataAxlePlatform from "../../app/data_axle_platform.app";
import { PLACES_PACKAGES } from "../../common/constants";

export default {
  key: "data_axle_platform-search-companies",
  name: "Search Companies",
  description: "Find relevant listings in the database. [See the docs here](https://platform.data-axle.com/places/docs/search_api#getting-started)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataAxlePlatform,
    query: {
      type: "string",
      label: "Query",
      description: "Find a record with a free-form search.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "By default, up to 10 records are returned. This can be changed with the limit parameter.",
      default: 10,
    },
    packages: {
      propDefinition: [
        dataAxlePlatform,
        "packages",
      ],
      default: "standard_v1",
      options: PLACES_PACKAGES,
    },
  },
  async run({ $ }) {
    const {
      dataAxlePlatform,
      ...data
    } = this;

    const response = await dataAxlePlatform.searchPlaces({
      $,
      data,
    });

    $.export("$summary", `${response.documents.length} compan${response.documents.length > 1
      ? "ies were"
      : "y was" } successfully fetched!`);
    return response;
  },
};
