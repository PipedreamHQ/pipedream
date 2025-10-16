import { ConfigurationError } from "@pipedream/platform";
import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-create-job",
  name: "Create Job",
  description:
    "Creates a new job (card) in Qntrl. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=CreateJob)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    qntrl,
    orgId: {
      propDefinition: [
        qntrl,
        "orgId",
      ],
    },
    formId: {
      propDefinition: [
        qntrl,
        "formId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the job.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the job.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description:
        "The due date of the job as a valid date string, e.g. `2016-02-29T12:12:12+0530` or `2016-02-29`.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in this request. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=CreateJob) for all available parameters.",
      optional: true,
    },
  },
  methods: {
    fieldToProp(field) {
      const result = {};
      /* eslint-disable no-fallthrough */
      switch (field.field_type_value) {
      case "PICKLIST":
        result.options = field.picklist_details?.map?.((option) => ({
          label: option.value,
          value: option.picklist_id,
        }));
      case "TEXT":
      case "MLTEXT":
      case "DATETIME":
      default:
        result.type = "string";
        break;
      }
      return result;
    },
  },
  async additionalProps() {
    const result = {};
    const {
      orgId, formId,
    } = this;
    const formDetails = await this.qntrl.getFormDetails({
      orgId,
      formId,
    });
    formDetails?.section_details?.forEach?.((section) => {
      section.sectionfieldmap_details?.forEach?.((fieldmap) => {
        fieldmap.customfield_details?.forEach?.((field) => {
          const columnName = field.column_name;
          if (columnName.startsWith("customfield")) {
            result[columnName] = {
              label: field.alias_name,
              description: `${field.alias_name} (\`${columnName}\`)`,
              optional: !fieldmap.is_mandatory,
              ...this.fieldToProp(field),
            };
          }
        });
      });
    });
    return result;
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      qntrl, fieldToProp, orgId, formId, dueDate, additionalOptions, ...data
    } = this;
    const dateObj = new Date(dueDate);
    const isInvalidDate = isNaN(dateObj.valueOf());
    if (dueDate && isInvalidDate) {
      throw new ConfigurationError("Invalid date string for `Due Date`");
    }

    const response = await qntrl.createJob({
      $,
      orgId,
      data: {
        layout_id: formId,
        duedate: isInvalidDate
          ? undefined
          : (dateObj?.toISOString().slice(0, -5) + "+0000"),
        ...data,
        ...additionalOptions,
      },
    });
    $.export("$summary", `Successfully created job (ID: ${response.id})`);
    return response;
  },
};
