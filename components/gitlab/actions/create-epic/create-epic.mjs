import lodash from "lodash";
import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-create-epic",
  name: "Create Epic",
  description: "Creates a new epic. [See the documentation](https://docs.gitlab.com/ee/api/epics.html#new-epic)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
    parent_id: {
      propDefinition: [
        gitlab,
        "epicIid",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      label: "Parent ID",
      optional: true,
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
        ({ groupId }) => ({
          groupId,
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
    const data = lodash.pickBy(lodash.pick(this, [
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
    data.labels = data.labels?.join();

    const response = await this.gitlab.createEpic(this.groupId, {
      data,
    });
    $.export("$summary", `Created epic ${this.title}`);
    return response;
  },
};
