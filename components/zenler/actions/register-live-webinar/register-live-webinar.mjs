import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-register-live-webinar",
  name: "Register Live Webinar",
  description: "Registers a live webinar. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#1966fea2-8274-49bd-f96d-54c215f9d302)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenler,
    webinarId: {
      propDefinition: [
        zenler,
        "webinarId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the live webinar",
    },
  },
  async run({ $ }) {
    const {
      webinarId,
      email,
    } = this;

    const response = await this.zenler.registerLiveWebinar({
      webinarId,
      data: {
        email,
      },
    });

    if (typeof(response) === "string") {
      console.log(response);
      throw new Error("Response error");
    }

    const { data } = response;

    $.export("$summary", data.message);

    return response;
  },
};
