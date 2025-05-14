/**
 * Anything that touches Supabase APIs directly
 */
import { createClient } from "@supabase/supabase-js"

export function createSupabaseClient() {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL environment variable is required")
  }
  if (!process.env.SUPABASE_API_KEY) {
    throw new Error("SUPABASE_API_KEY environment variable is required")
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)
}

export type RelevantApp = {
  name: string
  slug: string
  description: string
  hid: string
  similarity: number
}

export type AppInfo = {
  id: number
  hid: string
  name: string
  name_slug: string
  description: string
  img_src: string
  category_name: string
  website_url: string
  api_docs_url: string
}

export async function findRelevantApps(vectors: string[]) {
  let apps: RelevantApp[] = []
  const supabase = createSupabaseClient()
  const rpc = "find_apps_v2"
  const { data, error } = await supabase.rpc(rpc, {
    query_embeddings: vectors,
    similarity_threshold: 0, // we just care about the top matches, even if they're not very similar
    match_count: 50, // arbitrary, but we don't yet return perfect matches at the top. This is a first pass, the LLM takes over from here
  })
  if (!error) {
    // Apps are ordered by similarity by design — we want to list the most relevant apps first
    apps = (data ?? []) as RelevantApp[]
  }
  return apps
}

export async function listApps({
  search = "",
  page = 1,
  pageSize = 10,
}: {
  search?: string
  page?: number
  pageSize?: number
} = {}): Promise<{ apps: AppInfo[]; total: number }> {
  const supabase = createSupabaseClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("apps")
    .select(
      "APP_ID, APP_HID, APP_NAME, APP_NAME_SLUG, APP_DESCRIPTION, APP_IMG_SRC, CATEGORY_NAME, APP_WEBSITE_URL, APP_API_DOCS_URL",
      { count: "exact" }
    )
    .eq("PD_BUILDER_ONLY", false)
    .order("APP_FEATURED_WEIGHT", { ascending: false })

  if (search) {
    query = query.ilike("APP_NAME", `%${search}%`)
  }

  const { data, count, error } = await query.range(
    offset,
    offset + pageSize - 1
  )

  if (error) {
    console.error("Error fetching apps:", error)
    return { apps: [], total: 0 }
  }

  const apps = (data || []).map((app) => ({
    id: app.APP_ID,
    hid: app.APP_HID,
    name: app.APP_NAME,
    name_slug: app.APP_NAME_SLUG,
    description: app.APP_DESCRIPTION,
    img_src: app.APP_IMG_SRC,
    category_name: app.CATEGORY_NAME,
    website_url: app.APP_WEBSITE_URL,
    api_docs_url: app.APP_API_DOCS_URL,
  }))

  return {
    apps,
    total: count || 0,
  }
}
