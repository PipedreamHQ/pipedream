other_example = """## Another example source

Here's an example Pipedream source component that receives a webhook from Tally for every new form response and processes the incoming event data:

export default {
  key: "tally-new-response",
  name: "New Response",
  version: "0.0.{{ts}}",
  description: "Emit new event on each form message. [See the documentation](${docsLink})",
  type: "source",
  dedupe: "unique",
  props: {
    tally: {
      type: "app",
      app: "tally",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    formId: {
      type: "string",
      label: "Form",
      description: "Select a form",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  async run(event) {
    const { data: response } = event;
    this.$emit(response, {
      id: response.responseId,
      summary: `New response for ${response.formName} form`,
      ts: Date.parse(response.createdAt),
    });
  },
};

The code you generate should be placed within the `run` method of the Pipedream component:

import { axios } from "@pipedream/platform";

export default {
  props: {
    the_app_name_slug: {
      type: "app",
      app: "the_app_name_slug",
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  async run(event) {
    // your code here
  },
};"""
