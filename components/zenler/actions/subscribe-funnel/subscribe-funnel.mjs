import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-subscribe-funnel",
  name: "Subscribe Funnel",
  description: "Subscribes to a funnel. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#subscribe_to_funnel)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenler,
    funnelId: {
      propDefinition: [
        zenler,
        "funnelId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the funnel",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the funnel",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      funnelId,
      name,
      email,
      lastName,
      address,
      city,
    } = this;

    const response = await this.zenler.subscribeToFunnel({
      funnelId,
      data: {
        name,
        email,
        last_name: lastName,
        address,
        city,
      },
    });

    if (typeof(response) === "string") {
      console.log(response);
      throw new Error("Response error");
    }

    const { data } = response;

    $.export("$summary", `Successfully subscribed to funnel ${data.funnel}`);

    return response;
  },
};
