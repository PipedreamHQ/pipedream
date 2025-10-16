import { ConfigurationError } from "@pipedream/platform";
import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-obtain-crime-outcomes",
  name: "Obtain Crime Outcomes",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      date,
      lat,
      lng,
      poly,
    } = this;

    if (!lat && !lng && !poly)
      throw new ConfigurationError("It is necessary to use at least one type of localization, lat/lng or poly");

    const reg = new RegExp(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/);

    if (!reg.exec(lat) || !reg.exec(lng))
      throw new ConfigurationError("Invalid lat/lng value");

    const response = await dataPoliceUK.listOutcomes({
      $,
      params: {
        date: date
          ? `${date.split("-")[0]}-${date.split("-")[1]}`
          : null,
        lat,
        lng,
        poly,
      },
    });

    const length = response.length;

    $.export("$summary", `${length} outcome${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
