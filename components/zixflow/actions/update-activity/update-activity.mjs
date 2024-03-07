import app from "../../zixflow.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "zixflow-update-activity",
  name: "Update Activity",
  description: "Updates an existing activity or task in Zixflow. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/edit)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
      reloadProps: true,
    },
    iconType: {
      propDefinition: [
        app,
        "iconType",
      ],
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
    },
    associatedId: {
      propDefinition: [
        app,
        "associatedId",
      ],
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
    const response = await this.app.updateActivity({
      $,
      activityId: this.activityId,
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

    $.export("$summary", `Successfully updated activity with ID ${this.activityId}`);
    return response;
  },
};
