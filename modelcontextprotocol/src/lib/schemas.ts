import { z } from "zod"

export const ConfigureComponentRawSchema = {
  componentKey: z.string(),
  propName: z.string(),
}

export const QueryToolSchema = {
  query: z.string(),
}

export const SelectAppsSchema = {
  apps: z.array(z.string()),
}
