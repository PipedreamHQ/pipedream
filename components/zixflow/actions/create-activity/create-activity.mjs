import app from "../../zixflow.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "zixflow-create-activity",
  name: "Create Activity",
  description: "Creates a new activity or task within Zixflow. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    iconType: {
      propDefinition: [
        app,
        "iconType",
      ],
      reloadProps: true,
    },
    iconValue: {
      type: "string",
      label: "Icon Value",
      description: "Defines the specific value of the icon based on the iconType",
    },
    scheduleAt: {
      propDefinition: [
        app,
        "scheduleAt",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
      optional: true,
    },
    associationType: {
      propDefinition: [
        app,
        "associationType",
      ],
      optional: true,
    },
    associatedId: {
      propDefinition: [
        app,
        "associatedId",
        (c) => ({
          associationType: c.associationType,
        }),
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {
      iconValue: {
        type: "string",
        label: "Icon Value",
        description: "Defines the specific value of the icon based on the iconType",
      },
    };

    if (this.iconType !== "emoji") {
      props.iconValue.options = this.iconType === "interaction"
        ? constants.INTERACTION_TYPES
        : constants.MESSAGING_TYPES;
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.app.createActivity({
      $,
      data: {
        iconType: this.iconType,
        iconValue: this.iconValue,
        scheduleAt: this.scheduleAt,
        name: this.name,
        description: this.description,
        status: this.statusId,
        associated: this.associatedId,
      },
    });

    $.export("$summary", `Successfully created activity with title '${this.name}'`);
    return response;
  },
};
