import lodash from "lodash";
import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-create-epic",
  name: "Create Epic",
  description: "Creates a new epic. [See docs](https://docs.gitlab.com/ee/api/epics.html#new-epic)",
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
    parent_id: {
      propDefinition: [
        gitlab,
        "epicId",
        (c) => ({
          groupPath: c.groupPath,
        }),
      ],
    },
    title: {
      propDefinition: [
        gitlab,
        "title",
      ],
      description: "The title of the epic",
    },
    labels: {
      propDefinition: [
        gitlab,
        "groupLabels",
        (c) => ({
          groupPath: c.groupPath,
        }),
      ],
    },
    description: {
      propDefinition: [
        gitlab,
        "description",
      ],
      description: "The description of the issue",
    },
    color: {
      propDefinition: [
        gitlab,
        "color",
      ],
    },
    confidential: {
      propDefinition: [
        gitlab,
        "confidential",
      ],
    },
    created_at: {
      propDefinition: [
        gitlab,
        "created_at",
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
      "parent_id",
      "title",
      "labels",
      "description",
      "color",
      "confidential",
      "created_at",
      "start_date_is_fixed",
      "due_date_is_fixed",
      "start_date_fixed",
      "due_date_fixed",
    ]));
    opts.labels = opts.labels?.join();

    const response = await this.gitlab.createEpic(this.groupPath, this.title, opts);
    $.export("$summary", `Created epic ${this.title}`);
    return response;
  },
};
