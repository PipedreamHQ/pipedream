import { ConfigurationError } from "@pipedream/platform";

export function handleErrorResponse(status, body) {
  const scopes = body?.context?.requiredGranularScopes;
  if (status === 403 && scopes?.length) {
    const message = `You do not have access to perform this action. Missing scopes: ${scopes.map((scope) => `\`${scope}\``).join(", ")}
    
    See the [HubSpot documentation](https://developers.hubspot.com/docs/apps/legacy-apps/authentication/scopes#list-of-available-scopes) for more information.`;
    throw new ConfigurationError(message);
  }
}
