import lodash from "lodash";
import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-update-epic",
  name: "Update Epic",
  description: "Updates an epic. [See docs](https://docs.gitlab.com/ee/api/epics.html#update-epic)",
  version: "0.0.1",
  type: "action",
  props: {
    gitlab,
    groupPath: {
      propDefinition: [
        gitlab,
        "groupPath",
      ],
    },
    epicIid: {
      propDefinition: [
        gitlab,
        "epicIid",
      ],
    },
    add_labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        (c) => ({
          groupPath: c.groupPath,
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
        (c) => ({
          groupPath: c.groupPath,
        }),
      ],
      description: "Comma-separated label names for an issue. Set to an empty string to unassign all labels.",
    },
    parent_id: {
      propDefinition: [
        gitlab,
        "epicId",
        (c) => ({
          groupPath: c.groupPath,
        }),
      ],
      label: "Parent Id",
      description: "The ID of a parent epic. Available in GitLab 14.6 and later",
    },
    remove_labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        (c) => ({
          groupPath: c.groupPath,
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
    const opts = lodash.pickBy(lodash.pick(this, [
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
    opts.labels = opts.labels?.join();

    const response = await this.gitlab.updateEpic(this.groupPath, this.epicIid, opts);
    $.export("$summary", `Updated epic ${this.epicIid}`);
    return response;
  },
};
