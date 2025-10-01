import certifier from "../../certifier.app.mjs";

export default {
  name: "Create Group",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "certifier-create-group",
  description:
    "Create a group. [See the documentation](https://developers.certifier.io/reference/create-a-group)",
  props: {
    certifier,
    name: {
      propDefinition: [
        certifier,
        "groupName",
      ],
    },
    certificateDesignId: {
      propDefinition: [
        certifier,
        "certificateDesignId",
      ],
    },
    badgeDesignId: {
      propDefinition: [
        certifier,
        "badgeDesignId",
      ],
    },
    learningEventUrl: {
      propDefinition: [
        certifier,
        "learningEventUrl",
      ],
    },
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "warning",
      content:
        "At least one of `Certificate Design` and `Badge Design` fields is required.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      certifier,
      name,
      certificateDesignId,
      badgeDesignId,
      learningEventUrl,
    } = this;

    const response = await certifier.createGroup({
      $,
      data: {
        name,
        certificateDesignId,
        badgeDesignId,
        learningEventUrl,
      },
    });

    $.export(
      "$summary",
      `Successfully created group ${response.name}`,
    );

    return response;
  },
};
