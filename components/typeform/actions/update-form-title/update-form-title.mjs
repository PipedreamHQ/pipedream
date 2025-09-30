import typeform from "../../typeform.app.mjs";
import utils from "../utils.mjs";

const { reduceProperties } = utils;

export default {
  key: "typeform-update-form-title",
  name: "Update Form Title",
  description: "Updates an existing form's title. [See the docs here](https://developer.typeform.com/create/reference/update-form-patch/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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

    const dataObj = reduceProperties({
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
      $.export("$summary", `Successfully updated the form title to "${this.title}"`);
      return {
        id: formId,
        title: this.title,
        success: true,
      };
    }

    return response;
  },
};
