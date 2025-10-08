import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-service-point",
  name: "Get Service Point",
  description: "Retrieve a service point by ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/service-points/operations/get-a-service-point)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    servicePointId: {
      label: "Service Point ID",
      propDefinition: [
        app,
        "servicePointId",
        ({ country }) => ({
          country,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      servicePointId,
    } = this;

    const response = await app.getServicePoint({
      $,
      servicePointId,
    });

    $.export("$summary", `Successfully retrieved service point \`${servicePointId}\``);

    return response;
  },
};

