import { ConfigurableProp } from "@pipedream/sdk"

// Base state interface with common properties
interface BaseState {
  availableApps?: string[]
  selectedApps?: string[]
  dynamicProps?: readonly ConfigurableProp[]
  dynamicPropsId?: string
  configuredProps?: Record<string, any>
}

export type InitialState = BaseState & {
  stage: "INITIAL"
}

export type AvailableAppsState = BaseState & {
  stage: "AVAILABLE_APPS"
  availableApps: string[]
}

export type AppsSelectedState = BaseState & {
  stage: "APPS_SELECTED"
  selectedApps: string[]
}

export type ComponentSelectedState = BaseState & {
  stage: "TOOL_SELECTED"
  selectedApps: string[]
  currentComponentKey: string
}

export type ConfiguringToolState = BaseState & {
  stage: "CONFIGURING_TOOL"
  currentComponentKey: string
  configuredProps: Record<string, any>
  shownProps: string[]
}

export type ToolConfigurationCompletedState = BaseState & {
  stage: "TOOL_CONFIGURATION_COMPLETED"
  currentComponentKey: string
  configuredProps: Record<string, any>
  shownProps: string[]
}

export type ToolConfigState =
  | InitialState
  | AvailableAppsState
  | AppsSelectedState
  | ComponentSelectedState
  | ConfiguringToolState
  | ToolConfigurationCompletedState

export type Stage = ToolConfigState["stage"]
