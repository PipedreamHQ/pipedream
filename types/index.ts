/* eslint-disable @typescript-eslint/ban-types */
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

type SendPayload = any
interface SendConfigHTTPKv {
  [key: string]: string
}
interface SendConfigHTTPAuth {
  username: string
  password: string
}
type UppercaseHTTPMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH"
interface SendConfigHTTP {
  method?: UppercaseHTTPMethod
  url: string
  headers?: SendConfigHTTPKv
  params?: SendConfigHTTPKv
  auth?: SendConfigHTTPAuth
  data?: SendPayload
}
interface SendConfigS3 {
  bucket: string
  prefix: string
  payload: SendPayload
}
interface SendConfigEmail {
  subject: string
  text?: string
  html?: string
}
interface SendConfigEmit {
  raw_event: SendPayload
}
interface SendConfigSSE {
  channel: string
  payload: SendPayload
}
interface SendFunctionsWrapper {
  http: (config: SendConfigHTTP) => void
  email: (config: SendConfigEmail) => void
  emit: (config: SendConfigEmit) => void
  s3: (config: SendConfigS3) => void
  sse: (config: SendConfigSSE) => void
}

/**
 * Http Response.
 */
interface HTTPResponse {
  /**
   * HTTP Status
   */
  status: number
  /**
   * Http Body
   */
  body: string | Buffer | ReadableStream
  /**
   * If true, issue the response when the promise returned is resolved, otherwise issue
   * the response at the end of the workflow execution
   */
  immediate?: boolean
}

type Methods = { [key: string]: Function }

interface FlowFunctions {
  exit: (reason: string) => void
}

interface Pipedream {
  export: (key: string, value: JSONValue) => void
  send: SendFunctionsWrapper
  /**
   * Respond to an HTTP interface.
   * @param response Define the status and body of the request.
   * @returns A promise that is fulfilled when the body is read or an immediate response is issued
   */
  respond: (response: HTTPResponse) => Promise<any> | void
  flow: FlowFunctions
}

// https://pipedream.com/docs/components/api/#props
type UserPropType = "boolean" | "boolean[]" | "integer" | "integer[]" | "string" | "string[]" | "object" | "any"
// https://pipedream.com/docs/components/api/#interface-props
type InterfacePropType = "$.interface.http" | "$.interface.timer"
// https://pipedream.com/docs/components/api/#db
type ServiceDBPropType = "$.service.db"
// https://pipedream.com/docs/code/nodejs/using-data-stores/#using-the-data-store
type DataStorePropType = "data_store"

// https://pipedream.com/docs/components/api/#async-options-example
type OptionsMethodArgs = {
  page: number
  prevContext: string
}

// https://pipedream.com/docs/components/api/#prop-definitions-example
interface PropDefinitionReference {
  propDefinition: [App<AppPropDefinitions, Methods, AuthKeys>, string]
}

type AuthKeys = {
  [key: string]: string
}
type DollarAuth = {
  $auth: Record<keyof AuthKeys, string>
}

// https://pipedream.com/docs/components/api/#app-props
interface App<AppPropDefinitions, Methods, AuthKeys> {
  type: "app"
  app: string
  propDefinitions?: AppPropDefinitions | undefined
  methods?: (Methods | undefined) &
    ThisType<AppPropDefinitions & Methods & DollarAuth>
  $auth?: AuthKeys
}

interface DefaultConfig {
  intervalSeconds?: number
  cron?: string
}

interface BasePropInterface {
  label?: string
  description?: string
}

type PropOptions = string[] | { [key: string]: string }[]

// https://pipedream.com/docs/components/api/#user-input-props
export interface UserProp extends BasePropInterface {
  type: UserPropType
  options: PropOptions | ((opts: OptionsMethodArgs) => Promise<PropOptions>)
  optional: boolean
  default: string
  secret: boolean
  min: number
  max: number
}

export interface InterfaceProp extends BasePropInterface {
  type: InterfacePropType
  default: string | DefaultConfig
}

export interface ServiceDBProp extends BasePropInterface {
  type: ServiceDBPropType
}

export interface DataStoreProp extends BasePropInterface {
  type: DataStorePropType
}

/* interface SourcePropDefinitions {
  [name: string]: PropDefinitionReference |
    App<AppPropDefinitions, Methods> | UserProp | InterfaceProp | ServiceDBProp
} */

interface ActionPropDefinitions {
  [name: string]: PropDefinitionReference |
    App<AppPropDefinitions, Methods, AuthKeys> | UserProp | DataStoreProp
}

interface ComponentPropDefinitions {
  [name: string]: PropDefinitionReference |
    App<AppPropDefinitions, Methods, AuthKeys> |
    UserProp | InterfaceProp | ServiceDBProp | DataStoreProp
}

interface AppPropDefinitions {
  [name: string]: PropDefinitionReference |
    App<AppPropDefinitions, Methods, AuthKeys> | UserProp
}

interface Hooks {
  deploy?: () => Promise<void>
  activate?: () => Promise<void>
  deactivate?: () => Promise<void>
}

interface ComponentRunOptions {
  $: Pipedream
  steps: { [key: string]: JSONValue }
}

interface SourceRunOptions {
  event: JSONValue
}

interface ActionRunOptions {
  $: Pipedream
}

// https://pipedream.com/docs/components/api/#run
interface EmitMetadata {
  id?: string | number
  name?: string
  summary?: string
  ts: number
}
export interface EmitConfig {
  event: JSONValue
  metadata?: EmitMetadata
}

/* type EmitFunction = {
  $emit: (config: EmitConfig) => Promise<void>
} */

interface BaseComponent<ComponentPropDefinitions, Methods> {
  key?: string
  name?: string
  description?: string
  version?: string
  methods?: Methods & ThisType<ComponentPropDefinitions & Methods>
}

export interface Component<ComponentPropDefinitions, Methods>
  extends BaseComponent<ComponentPropDefinitions, Methods> {
  type: "action" | "source"
  props: ComponentPropDefinitions
  additionalProps?: (
    previousPropDefs: ComponentPropDefinitions
  ) => Promise<ComponentPropDefinitions>
  run: (options?: ComponentRunOptions) =>
    Promise<void> & ThisType<ComponentPropDefinitions & Methods>
}

export interface Source<SourcePropDefinitions, Methods, EmitFunction>
extends BaseComponent<ComponentPropDefinitions, Methods> {
  type: "source"
  hooks?: Hooks & ThisType<SourcePropDefinitions & Methods & EmitFunction>
  props: SourcePropDefinitions
  dedupe?: "last" | "greatest" | "unique"
  additionalProps?: (
    previousPropDefs: SourcePropDefinitions
  ) => Promise<SourcePropDefinitions>
  run: (options?: SourceRunOptions) =>
    Promise<void> & ThisType<SourcePropDefinitions & Methods & EmitFunction>
}

export interface Action<ActionThis> extends BaseComponent<ComponentPropDefinitions, Methods> {
  type: "action"
  props: ActionPropDefinitions & ThisType<ActionThis>
  additionalProps?: (
    previousPropDefs: ActionPropDefinitions
  ) => Promise<ActionPropDefinitions>
  run: (options?: ActionRunOptions) => Promise<void> & ThisType<ActionThis>
}

//export declare function defineComponent(component: Component): Component
export function defineSource<SourcePropDefinitions, Methods, EmitFunction>
(component: Source<SourcePropDefinitions, Methods, EmitFunction>):
Source<SourcePropDefinitions, Methods, EmitFunction> {
  return {
    ...component,
  };
}
//export declare function defineAction(component: Action): Action
export function defineApp<AppPropDefinitions, Methods, AuthKeys>
(app: App<AppPropDefinitions, Methods, AuthKeys>):
App<AppPropDefinitions, Methods, AuthKeys> {
  return {
    ...app,
  };
}
