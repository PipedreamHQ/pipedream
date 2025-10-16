import screendesk from "../../screendesk.app.mjs";

export default {
  key: "screendesk-retrieve-recording",
  name: "Retrieve A Recording",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a specific recording [See the documentation](https://dev.screendesk.io/recordings/get-retrieve-a-recording)",
  type: "action",
  props: {
    screendesk,
    uuid: {
      propDefinition: [
        screendesk,
        "uuid",
      ],
    },
  },
  async run({ $ }) {
    const {
      screendesk,
      uuid,
    } = this;

    const response = await screendesk.getRecording({
      $,
      uuid,
    });

    $.export("$summary", `The recording with UUID: ${response.uuid} was successfully fetched!`);
    return response;
  },
};
