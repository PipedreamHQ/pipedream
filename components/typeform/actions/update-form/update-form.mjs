import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-update-form",
  name: "Update a Form",
  description: "Updates an existing form. Request body must include all the existing form fields. [See the docs here](https://developer.typeform.com/create/reference/update-form-patch/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    title: {
      propDefinition: [
        typeform,
        "title",
      ],
    },
    workspaceHref: {
      propDefinition: [
        typeform,
        "workspaceHref",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      title,
      workspaceHref,
    } = this;

    const initialProps = {
      title: {
        op: "replace",
        path: "/title",
        value: title,
      },
    };

    const additionalProps = {
      workspace: [
        {
          op: "replace",
          path: "/workspace",
          value: {
            href: workspaceHref,
          },
        },
        workspaceHref,
      ],
    };

    const dataObj = this.reduceProperties({
      initialProps,
      additionalProps,
    });

    const data =
      Object.keys(dataObj)
        .map((key) => dataObj[key]);

    try {
      const response = await this.typeform.patchForm({
        $,
        formId,
        data,
      });

      if (!response) {
        return {
          id: formId,
          success: true,
        };
      }

      return response;

    } catch (error) {
      const message =
        error.response?.status === 404
          ? "Form not found. Please enter the ID again."
          : error;
      throw new Error(message);
    }
  },
};
