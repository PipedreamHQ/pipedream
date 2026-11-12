import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const STEPS_TEMPLATE_ID = 2;

export default {
  key: "testrail-add-case",
  name: "Add Case",
  description: "Create a test case in a TestRail section, with title, priority, preconditions, ordered steps and an expected result."
    + " Use after **List Sections** (or **Add Section**) gives you the `sectionId`, and after **List Cases** (`search`) shows the case does not already exist. Instances often require extra custom fields: check **Get Metadata** (`caseFields`, look for `is_required`) and pass them in `customFields`."
    + " `steps` is a list of step texts in order; giving steps switches the case to the \"Test Case (Steps)\" template (id 2) so each step is stored separately, and `expectedResult` becomes the expected outcome of the last step. Without `steps`, `expectedResult` is stored as the case-level expected result."
    + " `priority` takes a name (`High`) or id; `typeId` and `templateId` take ids from **Get Metadata** (`caseTypes`, `templates`)."
    + " Example: sectionId=78, title=\"Velociraptor escape drill\", priority=\"High\", steps=[\"Sound the alarm\",\"Lock the paddock gates\",\"Count heads\"], expectedResult=\"All raptors accounted for\" → returns `{ id: 1340, title, section_id: 78, priority_id: 3, template_id: 2 }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Case title, e.g. `Login fails with an expired password`.",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority name (e.g. `High`) or id. Omit for the instance default. See **Get Metadata** (`priorities`).",
      optional: true,
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "Case type id (Functional, Regression, ...). See **Get Metadata** (`caseTypes`).",
      optional: true,
    },
    templateId: {
      type: "integer",
      label: "Template ID",
      description: "Case template id. Defaults to 2 (\"Test Case (Steps)\") when `steps` is given, otherwise the instance default. See **Get Metadata** (`templates`).",
      optional: true,
    },
    preconditions: {
      type: "string",
      label: "Preconditions",
      description: "What must be true before the test starts.",
      optional: true,
    },
    steps: {
      type: "string[]",
      label: "Steps",
      description: "Ordered step texts, e.g. `[\"Open the login page\",\"Enter an expired password\",\"Submit\"]`.",
      optional: true,
    },
    expectedResult: {
      type: "string",
      label: "Expected Result",
      description: "The expected outcome. With `steps` it is attached to the last step.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Time estimate as a timespan: `30s`, `1m 45s`, `2h`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Comma-separated requirement or ticket ids, e.g. `INTC-443,REQ-12`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of other custom case fields keyed by `system_name`, e.g. `{\"custom_mission\":\"Verify gate locks\"}`. Required custom fields of your instance go here. See **Get Metadata** (`caseFields`).",
      optional: true,
    },
  },
  async run({ $ }) {
    let priorityId;
    if (this.priority !== undefined && this.priority !== "") {
      if (/^\d+$/.test(String(this.priority).trim())) {
        priorityId = Number(this.priority);
      } else {
        const priorities = await this.app._makeRequest({
          endpoint: "get_priorities",
        });
        const wanted = String(this.priority).trim()
          .toLowerCase();
        const match = priorities.find((p) => [
          p.name,
          p.short_name,
        ].some((v) => String(v).toLowerCase() === wanted));
        if (!match) {
          throw new Error(`Unknown priority "${this.priority}". Available: ${priorities.map((p) => `${p.name} (${p.id})`).join(", ")}`);
        }
        priorityId = match.id;
      }
    }

    const hasSteps = Boolean(this.steps?.length);
    const stepsData = hasSteps
      ? {
        custom_steps_separated: this.steps.map((content, i) => ({
          content,
          expected: i === this.steps.length - 1 && this.expectedResult
            ? this.expectedResult
            : "",
        })),
      }
      : {
        custom_expected: this.expectedResult,
      };

    const created = await this.app._makeRequest({
      endpoint: `add_case/${this.sectionId}`,
      method: "POST",
      data: {
        title: this.title,
        priority_id: priorityId,
        type_id: this.typeId,
        template_id: this.templateId || (hasSteps
          ? STEPS_TEMPLATE_ID
          : undefined),
        estimate: this.estimate,
        refs: this.refs,
        custom_preconds: this.preconditions,
        ...stepsData,
        ...utils.parseJson(this.customFields, "customFields"),
      },
    });
    $.export("$summary", `Created case ${created.id}: ${created.title}`);
    return {
      id: created.id,
      title: created.title,
      section_id: created.section_id,
      suite_id: created.suite_id,
      priority_id: created.priority_id,
      type_id: created.type_id,
      template_id: created.template_id,
      refs: created.refs,
      custom_preconds: created.custom_preconds,
      custom_steps_separated: created.custom_steps_separated,
      custom_expected: created.custom_expected,
    };
  },
};
