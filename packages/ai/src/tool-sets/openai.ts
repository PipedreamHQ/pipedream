import OpenAI from "openai/index.mjs";
import { ChatCompletionTool } from "openai/resources/chat/completions";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CoreTools } from "./core";

export class OpenAiTools {
  core: CoreTools;
  constructor(userId: string) {
    this.core = new CoreTools(userId);
  }

  async getTools(options?: {
    app?: string;
    query?: string;
  }): Promise<ChatCompletionTool[]> {
    const tools = await this.core.getTools(options);
    return tools.map((tool) => {
      return {
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: zodToJsonSchema(tool.schema),
        },
      };
    });
  }

  async handleCompletion(completion: OpenAI.Chat.Completions.ChatCompletion) {
    const toolCalls = completion.choices[0].message.tool_calls;
    if (!toolCalls) {
      return;
    }
    const results = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const toolName = toolCall.function.name;
        const tool = await this.core.getTool(toolName);
        if (!tool) {
          throw new Error(`Tool ${toolName} not found`);
        }

        const args = JSON.parse(toolCall.function.arguments);
        const parsedArgs = tool.schema.parse(args);

        const result = await tool.execute(parsedArgs);
        return result;
      }),
    );
    return results;
  }
}
