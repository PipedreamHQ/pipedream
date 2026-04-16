import cyfe from "../../cyfe.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cyfe-push-value",
  name: "Push Value",
  description: "Push a value to a Cyfe widget. [See the documentation](https://www.cyfe.com/api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    cyfe,
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "The ID of the Custom Chart Widget to push the value to. Found at the end of the API endpoint on the widget's configuration screen.",
    },
    data: {
      type: "object",
      label: "Data",
      description: `An object containing the data you want to push. [See the documentation](https://www.cyfe.com/api/) for more information.
      
**Example:**
\`\`\`json
{
  "data":  [
    {
      "Date":  "20130320",
      "Users":  "1"
    }
  ],
  "onduplicate":  {
    "Users":  "replace"
  },
  "color":  {
    "Users":  "#52ff7f"
  },
  "type":  {
    "Users":  "line"
  }
} 
\`\`\``,
    },
  },
  async run({ $ }) {
    const response = await this.cyfe.pushValue({
      $,
      widgetId: this.widgetId,
      data: parseObject(this.data),
    });
    if (response.status === "ok") {
      $.export("$summary", `Successfully pushed value to widget ${this.widgetId}`);
    }
    return response;
  },
};
