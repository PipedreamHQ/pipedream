import { V1Component } from "@pipedream/sdk"
import { componentMapper } from "../componentMapper"

export function componentAppName(component: V1Component): string | undefined {
  const { appKey } = componentMapper(component)
  return component.configurable_props.find((cp) => cp.name === appKey)?.app
}
