import app from "../../appdrag.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "appdrag-execute-api-function",
  name: "Execute API Function",
  description: "Executes an API function from a cloud backend. [See the documentation](https://support.appdrag.com/doc/Interacting-with-my-API-Functions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    path: {
      type: "string",
      label: "Function Name Path",
      description: "The name of the function name path to execute. Eg. `/insert-user`",
    },
    method: {
      type: "string",
      label: "HTTP Method",
      description: "The HTTP method to use when executing the function.",
      options: Object.values(constants.HTTP_METHOD),
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data to pass to the function.",
      optional: true,
    },
  },
  methods: {
    executeApiFunction({
      method, data, ...args
    } = {}) {
      return this.app.makeRequest(
        method === constants.HTTP_METHOD.GET
          ? {
            ...args,
            method,
            params: data,
          }
          : {
            ...args,
            method,
            data,
          },
      );
    },
  },
  async run({ $: step }) {
    const {
      executeApiFunction,
      path,
      method,
      data,
    } = this;

    const response = await executeApiFunction({
      step,
      path,
      method,
      data,
    });

    step.export("$summary", `Executed function \`${path}\` successfully`);

    return response;
  },
};
