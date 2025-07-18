// Represents the state of a tool configuration process

import { ConfigurableProp, V1Component } from "@pipedream/sdk"
import { pd } from "../../pd-client"
import { getAuthProvision } from "../authProvisions"
import { componentMapper } from "../componentMapper"
import { componentAppName } from "../utils"
import { beginConfigurationTool } from "./begin-configuration-tool"
import { queryTool } from "./query-tool"
import { runActionTool } from "./run-action-tool"
import { selectAppsTool } from "./select-apps-tool"
import { abortConfigurationTool } from "./abort-configuration-tool"
import { configurePropsToolTool } from "./configure-props-tool"
import { asyncOptionsTool } from "./async-options-tool"
import { runTool } from "./run-tool"
import {
  ToolConfigState,
  InitialState,
  AvailableAppsState,
  AppsSelectedState,
  ComponentSelectedState,
  ConfiguringToolState,
  ToolConfigurationCompletedState,
  Stage,
} from "./types"
import { configureComponentTool } from "./configure-component-tool"
import { WrappedTool } from "./wrapper"

// Cache interfaces
interface ComponentsCache {
  [appKey: string]: {
    components: V1Component[]
    timestamp: number
  }
}

interface SingleComponentCache {
  [componentKey: string]: {
    component: V1Component
    timestamp: number
  }
}

// Cache expiration time in milliseconds (12 hours)
const CACHE_EXPIRATION = 12 * 60 * 60 * 1000

// Shared cache storage
const componentsCache: ComponentsCache = {}
const singleComponentCache: SingleComponentCache = {}

// Cache management functions
function isValidCache(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_EXPIRATION
}

function clearExpiredCache(): void {
  // Clear expired app components
  for (const [app, cache] of Object.entries(componentsCache)) {
    if (!isValidCache(cache.timestamp)) {
      delete componentsCache[app]
    }
  }

  // Clear expired single components
  for (const [key, cache] of Object.entries(singleComponentCache)) {
    if (!isValidCache(cache.timestamp)) {
      delete singleComponentCache[key]
    }
  }
}

// Run cache cleanup periodically (every hour)
setInterval(clearExpiredCache, 60 * 60 * 1000)

/**
 * ToolConfigStateMachine
 *
 * Manages the state of the tool configuration process for the Pipedream MCP server.
 * This tracks the user's progress through selecting apps, tools, and configuring properties.
 */
export class ToolConfigStateMachine {
  state: ToolConfigState
  uuid: string
  appSlugToHashid: Record<string, string> = {}

  constructor(uuid: string) {
    this.state = {
      stage: "INITIAL",
    } satisfies InitialState
    this.uuid = uuid
  }

  getState(): ToolConfigState {
    return { ...this.state }
  }

  /**
   * Reset the state machine to its initial state
   */
  reset(): void {
    // TODO: Notify client about tool changes
    this.state = {
      stage: "INITIAL",
    } satisfies InitialState
  }

  isInConfigurationMode(): this is ToolConfigStateMachine & {
    state: ConfiguringToolState | ToolConfigurationCompletedState
  } {
    return this.isInStages(["CONFIGURING_TOOL", "TOOL_CONFIGURATION_COMPLETED"])
  }

  /**
   * Type guard for component selected modes (TOOL_SELECTED, CONFIGURING_TOOL or TOOL_CONFIGURATION_COMPLETED)
   */
  hasComponentSelected(): this is ToolConfigStateMachine & {
    state:
      | ComponentSelectedState
      | ConfiguringToolState
      | ToolConfigurationCompletedState
  } {
    return (
      this.state.stage === "TOOL_SELECTED" ||
      this.state.stage === "CONFIGURING_TOOL" ||
      this.state.stage === "TOOL_CONFIGURATION_COMPLETED"
    )
  }

  /**
   * Type guard for specific states
   */
  isInStages(stages: Stage[]): this is ToolConfigStateMachine & {
    state: Extract<ToolConfigState, { stage: Stage }>
  } {
    return stages.includes(this.state.stage)
  }

  /**
   * Type guard for having apps selected
   */
  hasAppsSelected(): this is ToolConfigStateMachine & {
    state:
      | AppsSelectedState
      | ComponentSelectedState
      | ConfiguringToolState
      | ToolConfigurationCompletedState
  } {
    return this.isInStages([
      "APPS_SELECTED",
      "TOOL_SELECTED",
      "CONFIGURING_TOOL",
      "TOOL_CONFIGURATION_COMPLETED",
    ])
  }

  /**
   * Type-safe state transitions
   */
  transitionToAvailableApps(availableApps: string[]): void {
    this.state = {
      stage: "AVAILABLE_APPS",
      availableApps,
    } satisfies AvailableAppsState
  }

  transitionToAppsSelected(selectedApps: string[]): void {
    this.state = {
      stage: "APPS_SELECTED",
      selectedApps,
      availableApps: this.state.availableApps || [],
    } satisfies AppsSelectedState
  }

  transitionToComponentSelected(componentKey: string): void {
    if (this.state.stage !== "APPS_SELECTED") {
      throw new Error(
        "Can only transition to component selected from apps selected stage"
      )
    }

    this.state = {
      stage: "TOOL_SELECTED",
      selectedApps: this.state.selectedApps,
      currentComponentKey: componentKey,
    } satisfies ComponentSelectedState
  }

  transitionToConfiguringTool(componentKey: string): void {
    if (
      this.state.stage !== "APPS_SELECTED" &&
      this.state.stage !== "TOOL_SELECTED"
    ) {
      throw new Error(
        "Can only transition to configuring tool from apps selected or tool selected stage"
      )
    }

    this.state = {
      stage: "CONFIGURING_TOOL",
      selectedApps: this.state.selectedApps,
      availableApps: this.state.availableApps || [],
      currentComponentKey: componentKey,
      configuredProps: {},
      shownProps: [],
    } satisfies ConfiguringToolState
  }

  transitionToToolConfigurationCompleted(): void {
    if (this.state.stage !== "CONFIGURING_TOOL") {
      throw new Error(
        "Can only transition to completed from configuring tool stage"
      )
    }

    this.state = {
      ...this.state,
      stage: "TOOL_CONFIGURATION_COMPLETED",
    } satisfies ToolConfigurationCompletedState
  }

  /**
   * Calculate which properties to show next based on reload properties
   */
  async getNextPropsToShow(): Promise<ConfigurableProp[]> {
    if (!this.isInConfigurationMode()) {
      throw new Error("Can only get next props in configuration mode")
    }

    const unshownProps = await this.getUnconfiguredProps()
    const reloadPropKeys = (await this.configurableProps())
      .filter((cp) => cp.reloadProps)
      .map((cp) => cp.name)

    // Find index of the next reload prop that hasn't been shown yet
    let includeUpToIndex = unshownProps.length

    for (let i = 0; i < unshownProps.length; i++) {
      if (reloadPropKeys.includes(unshownProps[i].name)) {
        includeUpToIndex = i + 1 // Include this property and stop
        break
      }
    }

    // Return props up to and including the next reload prop
    return unshownProps.slice(0, includeUpToIndex)
  }

  async getComponents(): Promise<V1Component[]> {
    if (!this.hasAppsSelected()) {
      throw new Error("No apps selected")
    }

    const components: V1Component[] = []
    const selectedApps = this.state.selectedApps || []

    // Run app component fetching in parallel
    await Promise.all(
      selectedApps.map(async (app) => {
        // Check cache first
        const cachedData = componentsCache[app]
        if (cachedData && isValidCache(cachedData.timestamp)) {
          components.push(...cachedData.components)
          return
        }

        // If not in cache or expired, fetch from API
        const { data: appComponents } = await pd.getComponents({
          app,
          componentType: "action",
          limit: 100,
        })

        // Run individual component fetching in parallel
        const fetchedComponents = await Promise.all(
          appComponents.map(async (_component) => {
            // Check single component cache first
            const cachedComponent = singleComponentCache[_component.key]
            if (cachedComponent && isValidCache(cachedComponent.timestamp)) {
              return cachedComponent.component
            }

            // If not in cache or expired, fetch from API
            const { data: component } = await pd.getComponent({
              key: _component.key,
            })

            // Cache the component
            singleComponentCache[_component.key] = {
              component,
              timestamp: Date.now(),
            }

            return component
          })
        )

        // Cache the components for this app
        componentsCache[app] = {
          components: fetchedComponents,
          timestamp: Date.now(),
        }

        components.push(...fetchedComponents)
      })
    )

    return components
  }

  async getComponent(key: string) {
    // Check single component cache first
    const cachedComponent = singleComponentCache[key]
    if (cachedComponent && isValidCache(cachedComponent.timestamp)) {
      return cachedComponent.component
    }

    // If not in cache, try to find in app components cache first
    for (const appCache of Object.values(componentsCache)) {
      if (isValidCache(appCache.timestamp)) {
        const component = appCache.components.find((c) => c.key === key)
        if (component) {
          // Cache it in single component cache too
          singleComponentCache[key] = {
            component,
            timestamp: Date.now(),
          }
          return component
        }
      }
    }

    // If still not found, fetch all components and find it
    const components = await this.getComponents()
    return components.find((c) => c.key === key)
  }

  async getCurrentComponent() {
    if (!this.hasComponentSelected()) {
      return
    }

    return this.getComponent(this.state.currentComponentKey)
  }

  async getCurrentComponentAppHashid() {
    const component = await this.getCurrentComponent()
    if (!component) {
      return
    }

    const appSlug = componentAppName(component)
    if (!appSlug) {
      return
    }
    return this.appSlugToHashid[appSlug]
  }

  async getTools() {
    const tools = [
      queryTool(this),
      selectAppsTool(this),
      configureComponentTool(this),
    ]
      .filter((t) => t.isActive(this.state.stage))
      .reduce(
        (acc, t) => {
          acc[t.name] = t.tool
          return acc
        },
        {} as Record<string, WrappedTool["tool"]>
      )

    if (this.state.stage === "APPS_SELECTED") {
      const components = await this.getComponents()
      for (const component of components) {
        const hasDynamicProps = component.configurable_props.find(
          (cp: ConfigurableProp) => cp.reloadProps
        )
        if (hasDynamicProps) {
          const tool = beginConfigurationTool({
            machine: this,
            component,
          })
          tools[tool.name] = tool.tool
        } else {
          const tool = await runActionTool({
            machine: this,
            component,
          })
          tools[tool.name] = tool.tool
        }
      }
    }

    if (this.state.stage === "CONFIGURING_TOOL") {
      const component = await this.getComponent(this.state.currentComponentKey)

      if (!component) {
        throw new Error("Component not found")
      }

      const abortTool = abortConfigurationTool({
        machine: this,
        component,
      })
      tools[abortTool.name] = abortTool.tool

      const { schema } = componentMapper(
        component,
        true,
        await this.getNextPropsToShow()
      )

      const configurePropsTool = configurePropsToolTool({
        machine: this,
        component,
        schema,
      })
      tools[configurePropsTool.name] = configurePropsTool.tool

      // Async options
      const asyncOptions = (await this.configurableProps()).filter(
        (cp) => cp.remoteOptions
      )
      // Async options that are currently inside schema
      const shownAsyncOptions = Object.keys(schema)
      asyncOptions
        .filter((ao) => shownAsyncOptions.includes(ao.name))
        .forEach((option) => {
          const tool = asyncOptionsTool({
            machine: this,
            component,
            option,
          })
          tools[tool.name] = tool.tool
        })
    }

    if (
      this.state.stage === "TOOL_CONFIGURATION_COMPLETED" ||
      (this.state.stage === "CONFIGURING_TOOL" &&
        (await this.requiredPropsConfigured()))
    ) {
      const component = await this.configuringComponent
      if (!component) {
        throw new Error("Component not found")
      }

      const tool = runTool({
        machine: this,
        component,
      })
      tools[tool.name] = tool.tool
    }

    return tools
  }

  get configuringComponent(): Promise<V1Component | undefined> {
    if (!this.isInConfigurationMode()) {
      throw new Error("Not in configuration mode")
    }
    return this.getComponent(this.state.currentComponentKey)
  }

  async reloadProps() {
    if (this.state.stage !== "CONFIGURING_TOOL") {
      throw new Error("Not in configuration mode")
    }

    const component = await this.configuringComponent
    if (!component) {
      throw new Error("Component not found")
    }

    const app = componentAppName(component)
    if (!app) {
      throw new Error("App not found")
    }

    const { appKey } = componentMapper(component)
    if (!appKey) {
      throw new Error("App key not found")
    }

    const authProvisionResponse = await getAuthProvision({
      app,
      uuid: this.uuid,
    })

    if (typeof authProvisionResponse === "string") {
      return {
        content: [
          {
            type: "text",
            text: authProvisionResponse,
            hashid: await this.getCurrentComponentAppHashid(),
          },
        ],
      }
    }

    const response = await pd.reloadComponentProps({
      componentId: {
        key: this.state.currentComponentKey,
      },
      dynamicPropsId: this.state.dynamicPropsId,
      configuredProps: {
        ...this.state.configuredProps,
        [appKey]: {
          authProvisionId: authProvisionResponse.id,
        },
      },
      externalUserId: this.uuid,
    })

    this.state.dynamicPropsId = response.dynamicProps.id
    this.state.dynamicProps = response.dynamicProps.configurableProps
  }

  async configurableProps() {
    if (!this.isInConfigurationMode()) {
      throw new Error("Not in configuration mode")
    }

    if (this.state.dynamicProps) {
      return this.state.dynamicProps
    }

    const component = await this.configuringComponent
    if (!component) {
      throw new Error("Component not found")
    }

    return component.configurable_props as ConfigurableProp[]
  }

  async getRemainingRequiredProps() {
    const props = await this.getUnconfiguredProps()
    return props.filter((cp) => cp.optional || cp.hidden)
  }

  async requiredPropsConfigured() {
    const component = await this.configuringComponent
    if (!component) {
      throw new Error("Component not found")
    }
    const props = await this.getUnconfiguredProps()
    return props
      .filter((cp) => !cp.optional && !cp.hidden && cp.type !== "app")
      .every((cp) =>
        Object.keys(this.state.configuredProps || {}).includes(cp.name)
      )
  }

  async getUnconfiguredProps(): Promise<ConfigurableProp[]> {
    if (!this.isInConfigurationMode()) {
      throw new Error("Can only get not shown props in configuration mode")
    }

    const component = await this.getCurrentComponent()
    if (!component) {
      throw new Error("Component not found")
    }

    const allProps = await this.configurableProps()
    const shownProps = this.state.shownProps

    return allProps.filter(
      (prop) =>
        !shownProps.includes(prop.name) && !prop.hidden && prop.type !== "app"
    )
  }

  async getRequiredProps(): Promise<ConfigurableProp[]> {
    const remainingProps = await this.getUnconfiguredProps()

    return remainingProps.filter((prop) => !prop.optional)
  }
}
