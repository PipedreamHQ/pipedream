import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "openai-submit-task-to-codex",
  name: "Submit Task to Codex",
  description: "Submit a coding task to OpenAI's code generation models. Translates natural language descriptions into code. [See the documentation](https://platform.openai.com/docs/codex)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    alert: {
      type: "alert",
      alertType: "info",
      content: "This action uses OpenAI's code-capable models to generate code from natural language descriptions. For chat-based interactions, consider using the **Chat** action instead.",
    },
    modelId: {
      type: "string",
      label: "Model",
      description: "The model to use for code generation",
      options: [
        "gpt-4",
        "gpt-4-turbo",
        "gpt-3.5-turbo",
      ],
    },
    task: {
      label: "Coding Task",
      type: "string",
      description: "Describe the coding task you want to accomplish. For example: 'Write a Python function to calculate the factorial of a number' or 'Create a JavaScript function to validate email addresses'",
    },
    language: {
      label: "Programming Language",
      type: "string",
      description: "The programming language you want the code to be written in (optional). If not specified, the model will infer from the task description.",
      optional: true,
      options: [
        "Python",
        "JavaScript",
        "TypeScript",
        "Java",
        "C++",
        "C#",
        "Go",
        "Rust",
        "Ruby",
        "PHP",
        "Swift",
        "Kotlin",
        "Shell/Bash",
        "SQL",
        "HTML",
        "CSS",
      ],
    },
    includeComments: {
      label: "Include Comments",
      type: "boolean",
      description: "Whether to include explanatory comments in the generated code",
      default: true,
      optional: true,
    },
    includeExample: {
      label: "Include Example Usage",
      type: "boolean",
      description: "Whether to include example usage of the generated code",
      default: false,
      optional: true,
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    _buildSystemMessage() {
      let systemMessage = "You are an expert software developer. Generate clean, efficient, and well-documented code based on the user's requirements.";

      if (this.language) {
        systemMessage += ` Focus on writing ${this.language} code.`;
      }

      if (this.includeComments) {
        systemMessage += " Include clear, explanatory comments in your code.";
      }

      if (this.includeExample) {
        systemMessage += " Provide an example of how to use the code after writing it.";
      }

      return systemMessage;
    },
    _buildUserMessage() {
      let userMessage = "";

      if (this.language) {
        userMessage += `Write ${this.language} code for the following task:\n\n`;
      } else {
        userMessage += "Write code for the following task:\n\n";
      }

      userMessage += this.task;

      return userMessage;
    },
    _getCodexArgs() {
      const messages = [
        {
          role: "system",
          content: this._buildSystemMessage(),
        },
        {
          role: "user",
          content: this._buildUserMessage(),
        },
      ];

      return {
        model: this.modelId || "gpt-3.5-turbo",
        messages,
        max_tokens: this.maxTokens || 1500,
        temperature: this.temperature
          ? +this.temperature
          : 0.1,
        top_p: this.topP
          ? +this.topP
          : 1,
        n: this.n,
        stop: this.stop,
        presence_penalty: this.presencePenalty
          ? +this.presencePenalty
          : this.presencePenalty,
        frequency_penalty: this.frequencyPenalty
          ? +this.frequencyPenalty
          : this.frequencyPenalty,
        user: this.user,
      };
    },
  },
  async run({ $ }) {
    const response = await this.openai.createChatCompletion({
      $,
      data: this._getCodexArgs(),
    });

    if (response) {
      $.export("$summary", `Successfully generated code for task: "${this.task.substring(0, 60)}${this.task.length > 60
        ? "..."
        : ""}"`);
    }

    return {
      task: this.task,
      language: this.language,
      generated_code: response.choices?.[0]?.message?.content?.trim() || "",
      full_response: response,
    };
  },
};
