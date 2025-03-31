import { z } from "zod"

export const ConfigureComponentRawSchema = {
  componentKey: z.string(),
  propName: z.string(),
}
