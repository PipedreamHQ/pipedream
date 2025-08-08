import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Reservations",
  description: "Retrieve reservations using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#get-all-reservations-ver-2023-06-06)",
  key: "mews-fetch-reservations",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      additionalFields,
    } = this;

    const items = await app.paginate({
      requester: app.reservationsGetAll,
      requesterArgs: {
        $,
        data: utils.parseJson(additionalFields),
      },
      resultKey: "Reservations",
    });

    $.export("summary", `Successfully fetched ${items.length} reservations`);
    return items;
  },
};

