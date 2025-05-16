# @pipedream/ai

> This library is in alpha status. The API is subject to breaking changes.

Create a .env file based on the .env.example file.

Basic example:
```ts
import { OpenAiTools } from "@pipedream/ai"
import { OpenAI } from "openai"

const openai = new OpenAI()

// Replace with a unique identifier for your user
const userId = <add user id here>

const openAiTools = new OpenAiTools(userId)
const tools = await openAiTools.getTools({
  app: "slack",
})

const completion = await openai.chat.completions.create({
  messages: [
    {
      role: "user",
      content: "Send a joke to #random channel",
    },
  ],
  model: "gpt-4o",
  tools,
})

const results = await openAiTools.handleCompletion(completion)

console.log(JSON.stringify(results, null, 2))

```