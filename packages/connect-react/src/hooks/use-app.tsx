import {
  useQuery, type UseQueryOptions,
} from "@tanstack/react-query";
import { useFrontendClient } from "./frontend-client-context";
import type {
  AppRequestResponse, AppResponse, ConfigurablePropApp,
  PropValue,
} from "@pipedream/sdk";

/**
 * Get details about an app
 */
export const useApp = (slug: string, opts?:{ useQueryOpts?: Omit<UseQueryOptions<AppRequestResponse>, "queryKey" | "queryFn">;}) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "app",
      slug,
    ],
    queryFn: () => client.app(slug),
    ...opts?.useQueryOpts,
  });

  return {
    ...query,
    app: query.data?.data,
  };
};

type AppResponseWithExtractedCustomFields = AppResponse & {
  extracted_custom_fields_names: string[]
}

type AppCustomField = {
  name: string
  optional?: boolean
}

type OauthAppPropValue = PropValue<"app"> & {
  oauth_access_token?: string
}

function getCustomFields(app: AppResponse): AppCustomField[] {
  const isOauth = app.auth_type === "oauth"
  const userDefinedCustomFields = JSON.parse(app.custom_fields_json || "[]")
  if ("extracted_custom_fields_names" in app && app.extracted_custom_fields_names) {
    const extractedCustomFields = ((app as AppResponseWithExtractedCustomFields).extracted_custom_fields_names || []).map(
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

export function appPropError(opts: { value: any, app: AppResponse | undefined }): string | undefined {
  const { app, value } = opts
  if (!app) {
    return "app field not registered"
  }
  if (!value) {
    return "no app configured"
  }
  if (typeof value !== "object") {
    return "not an app"
  }
  const _value = value as PropValue<"app">
  if ("authProvisionId" in _value && !_value.authProvisionId) {
    if (app.auth_type) {
      if (app.auth_type === "oauth" && !(_value as OauthAppPropValue).oauth_access_token) {
        return "missing oauth token"
      }
      if (app.auth_type === "oauth" || app.auth_type === "keys") {
        for (const cf of getCustomFields(app)) {
          if (!cf.optional && !_value[cf.name]) {
            return "missing custom field"
          }
        }
      }
      return "no auth provision configured"
    }
  }
}
