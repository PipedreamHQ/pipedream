import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-retrieve-crime-data",
  name: "Retrieve Crime Data",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Obtain crime data for a specific location and date range. [See the docs here](https://data.police.uk/docs/method/crime-street/)",
  type: "action",
  props: {
    dataPoliceUK,
    date: {
      propDefinition: [
        dataPoliceUK,
        "date",
      ],
      optional: true,
    },
    lat: {
      propDefinition: [
        dataPoliceUK,
        "lat",
      ],
      optional: true,
    },
    lng: {
      propDefinition: [
        dataPoliceUK,
        "lng",
      ],
      optional: true,
    },
    poly: {
      propDefinition: [
        dataPoliceUK,
        "poly",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dataPoliceUK,
      ...params
    } = this;

    const response = await dataPoliceUK.listCrimes({
      $,
      params,
    });

    const length = response.length;

    $.export("$summary", `${length} crime${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
