import lodash from "lodash";
import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-update-epic",
  name: "Update Epic",
  description: "Updates an epic. [See the documentation](https://docs.gitlab.com/ee/api/epics.html#update-epic)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gitlab,
    groupId: {
      propDefinition: [
        gitlab,
        "groupId",
      ],
    },
    epicIid: {
      propDefinition: [
        gitlab,
        "epicIid",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
    add_labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      label: "Add labels",
    },
    confidential: {
      propDefinition: [
        gitlab,
        "confidential",
      ],
    },
    description: {
      propDefinition: [
        gitlab,
        "description",
      ],
      description: "The description of the issue",
    },
    labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      description: "Comma-separated label names for an issue. Set to an empty string to unassign all labels.",
    },
    parent_id: {
      propDefinition: [
        gitlab,
        "epicIid",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      label: "Parent Id",
      description: "The ID of a parent epic. Available in GitLab 14.6 and later",
      optional: true,
    },
    remove_labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      label: "Remove labels",
      description: "Comma-separated label names to remove from an issue.",
    },
    stateEvent: {
      propDefinition: [
        gitlab,
        "stateEvent",
      ],
      options: [
        "close",
        "reopen",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        gitlab,
        "title",
      ],
      description: "The title of an epic",
      optional: true,
    },
    updated_at: {
      propDefinition: [
        gitlab,
        "updated_at",
      ],
    },
    color: {
      propDefinition: [
        gitlab,
        "color",
      ],
    },
    start_date_is_fixed: {
      propDefinition: [
        gitlab,
        "start_date_is_fixed",
      ],
      reloadProps: true,
    },
    due_date_is_fixed: {
      propDefinition: [
        gitlab,
        "due_date_is_fixed",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.start_date_is_fixed) {
      props.start_date_fixed = {
        type: "string",
        label: "Start date fixed",
        description: "The fixed start date of an epic (in GitLab 11.3 and later)",
      };
    }
    if (this.due_date_is_fixed) {
      props.due_date_fixed = {
        type: "string",
        label: "Due date fixed",
        description: "The fixed due date of an epic (in GitLab 11.3 and later)",
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "add_labels",
      "confidential",
      "description",
      "due_date_is_fixed",
      "due_date_fixed",
      "labels",
      "parent_id",
      "remove_labels",
      "start_date_is_fixed",
      "start_date_fixed",
      "stateEvent",
      "title",
      "updated_at",
      "color",
    ]));
    data.labels = data.labels?.join();

    const response = await this.gitlab.updateEpic(this.groupId, this.epicIid, {
      data,
    });
    $.export("$summary", `Updated epic ${this.epicIid}`);
    return response;
  },
};
