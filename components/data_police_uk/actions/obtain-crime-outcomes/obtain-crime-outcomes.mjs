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
