import type {
  App,
  ConfigurableProp,
  ConfigurablePropApp,
  ConfigurablePropBoolean,
  ConfigurablePropInteger,
  ConfigurablePropString,
  ConfigurablePropStringArray,
  PropOptionValue as SdkPropOptionValue,
  PropValue,
} from "@pipedream/sdk";
import { NestedLabelValueOption } from "../types";

export type PropOptionValue<T> = {
  __lv: {
    value: T
  }
}

export function valueFromOption<T>(value: T | PropOptionValue<T>): T | undefined | null {
  if (typeof value === "object" && value && "__lv" in value) {
    return (value as PropOptionValue<T>).__lv.value
  }
  return value
}

export type PropOption<T> = {
  emitValue: T | PropOptionValue<T>
}
export type PropOptions<T> = {
  selectedOptions: PropOption<T>[]
}

export function valuesFromOptions<T extends SdkPropOptionValue>(value: unknown | T[] | PropOptions<T>): T[] {
  if (typeof value === "object" && value && "selectedOptions" in value && Array.isArray(value.selectedOptions)) {
    const selectedOptions = value.selectedOptions as PropOption<T>[]
    const results: T[] = []
    for (const so of selectedOptions) {
      if (typeof so === "object" && so && "emitValue" in so) {
        const emitValue = so.emitValue as T | PropOptionValue<T>
        if (typeof emitValue === "object" && emitValue && "__lv" in emitValue) {
          results.push(emitValue.__lv.value)
        } else {
          results.push(emitValue as T)
        }
      } else {
        return []
      }
    }
    return results
  }
  if (value && typeof value === "object" && Array.isArray((value as NestedLabelValueOption<T>).__lv)) {
    return (value as NestedLabelValueOption<T>).__lv as T[]
  }
  if (!Array.isArray(value))
    return []
  return value as T[]
}

export type ValidationOpts<T extends ConfigurableProp> = {
  prop: T
  value: unknown
  app?: App
}

export function arrayPropErrors(opts: ValidationOpts<ConfigurablePropStringArray>): string[] | undefined {
  const _values = valuesFromOptions(opts.value)
  if (!opts.prop.default && typeof _values === "undefined") {
    return [
      "required",
    ]
  }
  if (!opts.prop.default && Array.isArray(_values) && !_values.length) return [
    "empty array",
  ]
}

export function booleanPropErrors(opts: ValidationOpts<ConfigurablePropBoolean>): string[] | undefined {
  const _value = valueFromOption(opts.value)
  if (_value == null || typeof _value === "undefined") return [
    "required",
  ]
}

export function integerPropErrors(opts: ValidationOpts<ConfigurablePropInteger>): string[] | undefined {
  const {
    prop, value: valueOpt,
  } = opts
  const value = valueFromOption(valueOpt)

  if (!prop.default && (value == null || typeof value === "undefined")) return [
    "required",
  ]

  const _value: number = typeof value === "number"
    ? value
    : parseInt(String(value))

  if (Number.isNaN(_value)) return [
    "not a number",
  ]
  const errs = []
  if (typeof prop.min === "number" && _value < prop.min) errs.push("number too small")
  if (typeof prop.max === "number" && _value > prop.max) errs.push("number too big")
  return errs
}

export function stringPropErrors(opts: ValidationOpts<ConfigurablePropString>): string[] | undefined {
  const {
    prop, value: valueOpt,
  } = opts

  if (!prop.default && (valueOpt == null || typeof valueOpt === "undefined")) return [
    "required",
  ]
}

type AppWithExtractedCustomFields = App & {
  extracted_custom_fields_names: string[]
}

type AppCustomField = {
  name: string
  optional?: boolean
}

type OauthAppPropValue = PropValue<"app"> & {
  oauth_access_token: string
}

type AppPropValueWithCustomFields<T extends AppCustomField[]> = PropValue<"app"> & {
  [K in T[number]["name"]]: T[number]
}

function getCustomFields(app: App): AppCustomField[] {
  const isOauth = app.authType === "oauth"
  const userDefinedCustomFields = JSON.parse(app.customFieldsJson || "[]")
  if ("extracted_custom_fields_names" in app && app.extracted_custom_fields_names) {
    const extractedCustomFields = ((app as AppWithExtractedCustomFields).extracted_custom_fields_names || []).map(
      (name) => ({
        name,
      }),
    )
    userDefinedCustomFields.push(...extractedCustomFields)
  }
  return userDefinedCustomFields.map((cf: AppCustomField) => {
    return {
      ...cf,
      // if oauth, treat all as optional (they are usually needed for getting access token)
      optional: cf.optional || isOauth,
    }
  })
}

export function appPropErrors(opts: ValidationOpts<ConfigurablePropApp>): string[] | undefined {
  const {
    app, value,
  } = opts
  if (!app) {
    return [
      "app field not registered",
    ]
  }
  if (!app.authType) {
    // These apps don't require authentication since they can't be configured
    // (i.e. authType == "none")
    return
  }
  if (!value) {
    return [
      "no app configured",
    ]
  }
  if (typeof value !== "object") {
    return [
      "not an app",
    ]
  }
  const _value = value as PropValue<"app">
  if ("authProvisionId" in _value && !_value.authProvisionId) {
    const errs = []
    if (app.authType === "oauth" && !(_value as OauthAppPropValue).oauth_access_token) {
      errs.push("missing oauth token")
    }
    if (app.authType === "oauth" || app.authType === "keys") {
      const customFields = getCustomFields(app)
      const _valueWithCustomFields = _value as AppPropValueWithCustomFields<typeof customFields>
      for (const cf of customFields) {
        if (!cf.optional && !_valueWithCustomFields[cf.name]) {
          errs.push(`missing custom field: ${cf.name}`)
        }
      }
    }

    return errs
  }
}
