import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-obtain-crime-outcomes",
  name: "Obtain Crime Outcomes",
  version: "0.0.1",
  description: "Access the specific outcomes of reported crimes within a given location and date range. [See the docs here](https://data.police.uk/docs/method/outcomes-at-location/)",
  type: "action",
  props: {
    dataPoliceUK,
    date: {
      type: "string",
      label: "Date",
      description: "(YYYY-MM) Limit results to a specific month. The latest month will be shown by default",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude of the requested crime area. You must use either lat/lng or poly, never both.",
      optional: true,
    },
    lng: {
      type: "string",
      label: "Longitude",
      description: "Longitude of the requested crime area. You must use either lat/lng or poly, never both.",
      optional: true,
    },
    poly: {
      type: "string",
      label: "Poly",
      description: "The lat/lng pairs which define the boundary of the custom area. The `poly` parameter is formatted in lat/lng pairs, separated by colons: `[lat],[lng]:[lat],[lng]:[lat],[lng]`.  You must use either lat/lng or poly, never both.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dataPoliceUK,
      ...params
    } = this;

    const response = await dataPoliceUK.listOutcomes({
      $,
      params,
    });

    const length = response.length;

    $.export("$summary", `${length} outcome${length > 1
      ? "s were"
      : "was"} successfully fetched!`);
    return response;
  },
};
