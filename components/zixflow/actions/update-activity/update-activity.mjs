import app from "../../zixflow.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "zixflow-update-activity",
  name: "Update Activity",
  description: "Updates an existing activity or task in Zixflow. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/edit)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
      reloadProps: true,
    },
    iconValue: {
      propDefinition: [
        app,
        "iconValue",
        (c) => ({
          iconType: c.iconType,
        }),
      ],
      optional: true,
    },
    scheduleAt: {
      propDefinition: [
        app,
        "scheduleAt",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      optional: true,
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
