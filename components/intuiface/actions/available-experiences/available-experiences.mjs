import app from "../../intuiface.app.mjs";

export default {
  key: "intuiface-available-experiences",
  name: "List Available Experiences",
  description: "Get a list of available experiences that can receive a message. [See the docs](https://my.intuiface.com/api-doc/#/default/getExperiences).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    experienceNames: {
      propDefinition: [
        app,
        "experienceNames",
      ],
    },
    experienceIds: {
      propDefinition: [
        app,
        "experienceIDs",
      ],
    },
    playerDeviceNames: {
      propDefinition: [
        app,
        "playerDeviceNames",
      ],
    },
    playerIds: {
      propDefinition: [
        app,
        "playerIds",
      ],
    },
    playerTags: {
      type: "string[]",
      label: "Player Tags",
      description: "Specify player(s) based on their tag(s).",
      optional: true,
    },
  },
  methods: {
    join(arr) {
      if (Array.isArray(arr)) {
        return arr.join(",");
      }
      return undefined;
    },
  },
  async run({ $ }) {
    const {
      experienceNames,
      experienceIds,
      playerDeviceNames,
      playerIds,
      playerTags,
    } = this;
    const result = await this.app.availableExperiences({
      $,
      params: {
        experienceNames: this.join(experienceNames),
        experienceIDs: this.join(experienceIds),
        playerDeviceNames: this.join(playerDeviceNames),
        playerIDs: this.join(playerIds),
        playerTags: this.join(playerTags),
      },
    });
    $.export("$summary", `Successfully fetched ${result.experienceCount} available experiences`);
    return result;
  },
};
