import app from "../../recreation_gov.app.mjs";

export default {
  key: "recreation_gov-get-recreation-area",
  version: "0.0.1",
  type: "action",
  name: "Get Recreation Area",
  description: "Retrieves details of a specific campsite. [See the documentation](https://ridb.recreation.gov/docs#/Campsites/getCampsites)",
  props: {
    app,
    recAreaId: {
      propDefinition: [
        app,
        "recAreaId",
      ],
    },
  },
  async run ({ $ }) {
    const resp = this.app.getRecArea({
      $,
      recAreaId: this.recAreaId,
      params: {
        full: "true",
      },
    });
    $.export("$summary", `Recreation Area - ${resp.RecAreaName} has been retrieved.`);
    return resp;
  },
};
