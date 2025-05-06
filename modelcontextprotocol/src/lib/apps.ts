import { createEmbeddings, extractEntities, identifyTopApps } from "./llm"
import { findRelevantApps } from "./supabase"

export async function findApps(content: string): Promise<{
  topApps: string[]
  relevantApps: { [key: string]: string }[]
}> {
  const apps: string[] = []
  if (!content) return apps

  const extractedEntities = await extractEntities(content)
  // Embed both the whole message and the extracted entities
  const entities = [content, ...(extractedEntities || [])]
  const embeddings = await createEmbeddings(entities)
  const vectors = embeddings?.data?.map((it) => JSON.stringify(it.embedding))
  const relevantApps = await findRelevantApps(vectors)
  const topApps = await identifyTopApps(content, relevantApps)
  return { topApps, relevantApps }
}
