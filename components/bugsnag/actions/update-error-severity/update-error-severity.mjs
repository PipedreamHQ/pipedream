import bugsnag from "../../bugsnag.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bugsnag-update-error-severity",
  name: "Update Error Severity",
  description: "Update an the severity status of an error in Bugsnag. [See the documentation](https://bugsnagapiv2.docs.apiary.io/#reference/errors/errors/update-an-error)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bugsnag,
    organizationId: {
      propDefinition: [
        bugsnag,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        bugsnag,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    errorId: {
      propDefinition: [
        bugsnag,
        "errorId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The Error's new severity. This will be reflected in the Error's `overridden_severity` property.",
      options: constants.ERROR_SEVERITIES,
    },
  },
  async run({ $ }) {
    const response = await this.bugsnag.updateError({
      $,
      projectId: this.projectId,
      errorId: this.errorId,
      data: {
        operation: "override_severity",
        severity: this.severity,
      },
    });

    $.export("$summary", `Updated error ${this.errorId}`);
    return response;
  },
};
