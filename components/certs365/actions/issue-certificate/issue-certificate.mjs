import certs365 from "../../certs365.app.mjs";

export default {
  name: "Issue Certificate",
  version: "0.0.1",
  key: "certs365-issue-certificate",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Issue a certificate via Certs365-beta API",

  type: "action",

  props: {
    certs365,

    name: {
      propDefinition: [
        certs365,
        "name",
      ],
    },

    recipientEmail: {
      propDefinition: [
        certs365,
        "recipientEmail",
      ],
    },

    courseName: {
      propDefinition: [
        certs365,
        "courseName",
      ],
    },

    templateId: {
      propDefinition: [
        certs365,
        "templateId",
      ],
    },

    customFields: {
      propDefinition: [
        certs365,
        "customFields",
      ],
    },
  },

  async run({ $ }) {
    const {
      certs365,
      name,
      recipientEmail,
      courseName,
      templateId,
      customFields,
    } = this;

    let parsedCustomFields;

    if (customFields) {
      try {
        parsedCustomFields = JSON.parse(customFields);
      } catch (e) {
        throw new Error("Invalid JSON in customFields");
      }
      if (
+        !parsedCustomFields ||
+        typeof parsedCustomFields !== "object" ||
+        Array.isArray(parsedCustomFields)
+      ) {
+        throw new Error("customFields must be a JSON object");
+      }
    }

    const response = await certs365.issueCertificate({
      $,
      data: {
        name,
        recipientEmail,
        course_name: courseName,
+       ...(templateId ? { templateId } : {}),
+       ...(parsedCustomFields ? { custom_fields: parsedCustomFields } : {}),
      },
    });

    $.export("$summary", `Certificate issued to ${recipientEmail}`);

    return response;
  },
};
