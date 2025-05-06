/**
 * Anything that touches the LLM APIs directly
 */
import OpenAI from "openai"
import entityExtractionPrompt from "./templates/entity-extraction-prompt"
import { RelevantApp } from "./supabase"
// XXX See https://github.com/openai/openai-node/issues/1378
import type { ResponseInput } from "openai/resources/responses/responses.mjs"

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
})

export async function createEmbeddings(input: string[]) {
  return openai.embeddings.create({
    model: "text-embedding-3-large",
    input,
  })
}

export async function extractEntities(query: string): Promise<string[]> {
  const input: ResponseInput = [
    {
      content: entityExtractionPrompt,
      role: "system",
    },
    {
      content: query,
      role: "user",
    },
  ]

  const response = await openai.responses.create({
    model: "gpt-4o-2024-11-20",
    temperature: 0,
    input,
    text: {
      format: {
        type: "json_schema",
        name: "ExtractedEntities",
        schema: {
          type: "object",
          properties: {
            apps: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["apps"],
          additionalProperties: false,
        },
      },
    },
  })
  let entities = []
  try {
    const outputText = JSON.parse(response.output_text)
    entities = outputText?.apps || []
  } catch (e) {
    // noop
  }
  return entities
}

export async function identifyTopApps(
  query: string,
  relevantApps: RelevantApp[]
): Promise<string[]> {
  const appXML = relevantApps.map(
    (app) =>
      `<app>
        <name>${app.name}</name>
        <slug>${app.slug}</slug>
        <description>${app.description}</description>
      </app>`
  )

  const prompt = `<identifying_top_apps>
  <goal>
    - Based on the user's query, identify the top apps that could relevant to the user's needs. 
    - Apps are ordered by relevance to the user query (most-relevant first).
    - ALWAYS return apps named in the user's query. Users may misspell or use common 
      synonyms for apps (e.g. "Sheets" for "Google Sheets"). Do your best to identify
      these apps.
    - Sometimes you'll receive an abstract query that doesn't specifically
      identify apps or services. In these cases, you should identify relevant apps
      or services from the the list provided. Use the description and your knowledge
      of the apps to determine which are most relevant.
    - ALWAYS prefer popular consumer services, unless the user identifies a
      specific app. For example:

      - Prefer Gmail over AWS SES or Sendgrid.
      - Prefer Notion or Google Drive to Box or OneDrive.
      - Prefer Slack over Microsoft Teams.
    
    - Only include the "app_slug" value in the output.
  <goal>
  <apps>
    - ${appXML.join("\n    - ")}
  </apps>
  <user_query>
    ${query}
  </user_query>
</identifying_top_apps>`
  const input: ResponseInput = [
    {
      content: prompt,
      role: "system",
    },
    {
      content: query,
      role: "user",
    },
  ]

  const response = await openai.responses.create({
    model: "gpt-4o-2024-11-20",
    temperature: 0,
    input,
    text: {
      format: {
        type: "json_schema",
        name: "TopApps",
        schema: {
          type: "object",
          properties: {
            apps: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["apps"],
          additionalProperties: false,
        },
      },
    },
  })
  let entities = []
  try {
    const outputText = JSON.parse(response.output_text)
    entities = outputText?.apps || []
  } catch (e) {
    // noop
  }
  return entities
}
