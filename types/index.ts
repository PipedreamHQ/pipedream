/* eslint-disable @typescript-eslint/ban-types */
export type JSONValue =
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
  body: string | Buffer | NodeJS.ReadableStream
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
  propDefinition: [App, string]
}

// https://pipedream.com/docs/components/api/#app-props
// See https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype
// for more information on this technique
export interface App {
  type: "app"
  app: string
  propDefinitions?: AppPropDefinitions | undefined
  methods?: (Methods | undefined) & ThisType<any>
}

// Props

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
  options?: PropOptions | ((opts: OptionsMethodArgs) => Promise<PropOptions>)
  optional?: boolean
  default?: JSONValue
  secret?: boolean
  min?: number
  max?: number
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

interface SourcePropDefinitions {
  [name: string]: PropDefinitionReference |
    App | UserProp | InterfaceProp | ServiceDBProp
}

interface ActionPropDefinitions {
  [name: string]: PropDefinitionReference | App | UserProp | DataStoreProp
}

interface AppPropDefinitions {
  [name: string]: PropDefinitionReference | App | UserProp
}

interface Hooks {
  deploy?: (this: any) => Promise<void>
  activate?: (this: any) => Promise<void>
  deactivate?: (this: any) => Promise<void>
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

export interface Source {
  key: string
  name?: string
  description?: string
  version: string
  type: "source"
  // XXX should be something like methods?: Methods & ThisType<PropKeys<SourcePropDefinitions> & Methods>
  methods?: Methods & ThisType<any>
  hooks?: Hooks & ThisType<any>
  props?: SourcePropDefinitions
  dedupe?: "last" | "greatest" | "unique"
  additionalProps?: (
    previousPropDefs: SourcePropDefinitions
  ) => Promise<SourcePropDefinitions>
  // XXX `this` should be strictly typed. For some reason the approach I took above
  // did not work here.
  run: (this: any, options?: SourceRunOptions) => Promise<void>
}

export interface Action {
  key: string
  name?: string
  description?: string
  version: string
  type: "action"
  methods?: Methods & ThisType<any>
  props?: ActionPropDefinitions & ThisType<any>
  additionalProps?: (
    previousPropDefs: ActionPropDefinitions
  ) => Promise<ActionPropDefinitions>
  // XXX `this` should be strictly typed. For some reason the approach I took above
  // did not work here.
  run: (this: any, options?: ActionRunOptions) => Promise<any>
}
