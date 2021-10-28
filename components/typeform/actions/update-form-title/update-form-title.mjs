import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-update-form-title",
  name: "Update a Form Title",
  description: "Updates an existing form's title. [See the docs here](https://developer.typeform.com/create/reference/update-form-patch/)",
  type: "action",
  version: "0.0.1",
  methods: {
    ...common.methods,
  },
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

    const response = await this.typeform.patchForm({
      $,
      formId,
      data,
    });

    if (!response) {
      return {
        id: formId,
        success: true,
      },
      $.export("$summary", `🎉 Successfully updated the form, "${this.title}"`)
    }

    return response;
  },
};