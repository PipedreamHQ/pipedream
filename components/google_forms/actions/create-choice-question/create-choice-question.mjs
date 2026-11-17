import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-create-choice-question",
  name: "Create Choice Question",
  description: "Adds one multiple-choice (radio), checkbox, or dropdown question to a Google Form."
    + " Use it when the user asks for a question where responders pick from a fixed list of answers."
    + " To add a short-answer or paragraph question, use **Create Text Question** instead."
    + " When `index` is omitted the question is appended to the end of the form (the form is fetched to count its items)."
    + " `includeOther` works only with `RADIO` or `CHECKBOX`; the tool throws an error for `DROP_DOWN`."
    + " Each call adds exactly one question; call it again to add more."
    + " Returns the new question's `itemId`, `questionId`, `index`, `title`, `type`, `options` (the choice values), and `required`."
    + " Example: formId=`1FAIpQLSdExampleFormId`, title=`Preferred meeting day`, type=`RADIO`, options=[`Monday`,`Wednesday`,`Friday`], required=true → returns the new item's itemId and its position in the form."
    + " [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate#createitemrequest)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleForms,
    formId: {
      propDefinition: [
        googleForms,
        "formId",
      ],
      description: "The ID of the form to add the question to, e.g. `1FAIpQLSdExampleFormId`. It is the `formId` returned by **Create Form** or **Get Form**.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The question text shown to responders, e.g. `Preferred meeting day`.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "How responders choose: `RADIO` (pick one), `CHECKBOX` (pick several), or `DROP_DOWN` (pick one from a dropdown).",
      options: [
        "RADIO",
        "CHECKBOX",
        "DROP_DOWN",
      ],
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "The answer choices, in display order, e.g. `[\"Monday\", \"Wednesday\", \"Friday\"]`. Provide at least one.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional helper text shown under the question, e.g. `Pick the day that suits you best`.",
      optional: true,
    },
    required: {
      type: "boolean",
      label: "Required",
      description: "Set to `true` to make an answer mandatory, e.g. `true`. When omitted the question is optional.",
      optional: true,
    },
    includeOther: {
      type: "boolean",
      label: "Include Other",
      description: "Set to `true` to add a free-text \"Other\" choice, e.g. `true`. Only valid with `RADIO` or `CHECKBOX`. When omitted no \"Other\" choice is added.",
      optional: true,
    },
    shuffle: {
      type: "boolean",
      label: "Shuffle",
      description: "Set to `true` to show the options in random order to each responder, e.g. `true`. When omitted the order is kept.",
      optional: true,
    },
    index: {
      type: "integer",
      label: "Index",
      description: "0-based position to insert the question at, e.g. `0` for the top of the form. Must be between 0 and the current number of items. When omitted the question is appended to the end.",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    if (!this.options?.length) {
      throw new Error("`options` must contain at least one choice.");
    }
    if (this.includeOther && this.type === "DROP_DOWN") {
      throw new Error("`includeOther` is only valid with `RADIO` or `CHECKBOX`, not `DROP_DOWN`.");
    }

    let index = this.index;
    if (index === undefined || index === null) {
      const form = await this.googleForms.getForm({
        $,
        formId: this.formId,
      });
      index = form.items?.length ?? 0;
    }

    const choices = this.options.map((value) => ({
      value,
    }));
    if (this.includeOther) {
      choices.push({
        isOther: true,
      });
    }

    const response = await this.googleForms.updateForm({
      $,
      formId: this.formId,
      data: {
        includeFormInResponse: false,
        requests: [
          {
            createItem: {
              item: {
                title: this.title,
                description: this.description,
                questionItem: {
                  question: {
                    required: this.required ?? false,
                    choiceQuestion: {
                      type: this.type,
                      options: choices,
                      shuffle: this.shuffle ?? false,
                    },
                  },
                },
              },
              location: {
                index,
              },
            },
          },
        ],
      },
    });

    const created = response?.replies?.[0]?.createItem ?? {};
    $.export("$summary", `Added ${this.type} question "${this.title}" at position ${index}`);
    return {
      itemId: created.itemId,
      questionId: created.questionId,
      index,
      title: this.title,
      type: this.type,
      options: this.options,
      required: this.required ?? false,
    };
  },
};
