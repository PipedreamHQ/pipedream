import { ConfigurationError } from "@pipedream/platform";
import leiga from "../../leiga.app.mjs";

export default {
  key: "leiga-create-issue",
  name: "Create Issue",
  description: "Creates a new issue within Leiga. [See the documentation](https://apidog.com/apidoc/shared-5a741107-c211-410f-880c-048d1917c984/api-3741813)",
  version: "0.0.1",
  type: "action",
  props: {
    leiga,
    projectId: {
      propDefinition: [
        leiga,
        "projectId",
      ],
      description: "The project ID in which you wish to create issue.",
    },
    issueTypeId: {
      propDefinition: [
        leiga,
        "issueTypeId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.issueTypeId) {
      const { data: { fields } } = await this.leiga.getIssueSchema({
        params: {
          projectId: this.projectId,
          issueTypeId: this.issueTypeId,
        },
      });

      for (const field of fields) {
        let propType = "string";
        let optionsField = {};

        if (field.options && field.options.length) {
          optionsField = {
            options: field.options.map((item) => ({
              label: item.name,
              value: `${item.value}`,
            })),
          };
        }

        if (field.multipleChoice) {
          propType += "[]";
        }

        props[field.fieldCode] = {
          type: propType,
          label: field.customFieldName,
          description: field.fieldDescription || `The ${field.fieldCode} of the issue.`,
          optional: !field.requiredFlag,
          ...optionsField,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      leiga,
      projectId,
      issueTypeId,
      ...data
    } = this;

    const response = await leiga.createIssue({
      $,
      data: {
        projectId,
        data,
        issueTypeId,
      },
    });
    if (response.code != "0") {
      throw new ConfigurationError(response.msg);
    }

    $.export("$summary", `Successfully created issue with Id: ${response.data.id}`);
    return response;
  },
};
