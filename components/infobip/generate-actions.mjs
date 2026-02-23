import fs from "fs/promises";
import path from "path";

/**
 * Script to automatically generate Pipedream actions for Infobip enhanced app methods
 * Parses the enhanced app file and creates action files for methods without existing actions
 * Now includes explicit parameter extraction from OpenAPI specification
 */

const ENHANCED_APP_PATH = "./infobip.app.mjs";
const OPENAPI_SPEC_PATH = "./openapi-spec.json";
const ACTIONS_DIR = "./actions";
const ACTION_TEMPLATE_PATH = "../../infobip.app.mjs";

// Methods that should be skipped during generation
const SKIP_METHODS = new Set([
  "_baseUrl",
  "_headers",
  "_makeRequest",
  "listApplications",
  "listEntities",
  "listResources",
  "sendSms",
  "sendViberMessage",
  "sendWhatsappMessage",
  "createHook",
  "deleteHook",
  "previewSmsMessage", // Already has existing action
]);

// Map method names to human-readable action names
const METHOD_NAME_MAP = {
  sendSmsMessagesOverQueryParameters: "Send SMS Messages Over Query Parameters",
  sendSmsMessageOverQueryParameters: "Send SMS Message Over Query Parameters",
  sendSmsMessage: "Send SMS Message V2",
  sendBinarySmsMessage: "Send Binary SMS Message",
  getScheduledSmsMessages: "Get Scheduled SMS Messages",
  rescheduleSmsMessages: "Reschedule SMS Messages",
  getScheduledSmsMessagesStatus: "Get Scheduled SMS Messages Status",
  updateScheduledSmsMessagesStatus: "Update Scheduled SMS Messages Status",
  logEndTag: "Confirm Conversion (Log End Tag)",
  getInboundSmsMessages: "Get Inbound SMS Messages",
  getOutboundSmsMessageDeliveryReportsV3: "Get Outbound SMS Message Delivery Reports V3",
  getOutboundSmsMessageLogsV3: "Get Outbound SMS Message Logs V3",
  getOutboundSmsMessageDeliveryReports: "Get Outbound SMS Message Delivery Reports",
  getOutboundSmsMessageLogs: "Get Outbound SMS Message Logs",
};

// Map method names to clean action keys (without infobip prefix)
const METHOD_TO_ACTION_KEY_MAP = {
  sendSmsMessages: "send-sms-messages",
  sendSmsMessagesOverQueryParameters: "send-sms-messages-over-query-parameters",
  sendSmsMessageOverQueryParameters: "send-sms-message-over-query-parameters",
  previewSmsMessage: "preview-sms-message",
  sendSmsMessage: "send-sms-message",
  sendBinarySmsMessage: "send-binary-sms-message",
  getScheduledSmsMessages: "get-scheduled-sms-messages",
  rescheduleSmsMessages: "reschedule-sms-messages",
  getScheduledSmsMessagesStatus: "get-scheduled-sms-messages-status",
  updateScheduledSmsMessagesStatus: "update-scheduled-sms-messages-status",
  logEndTag: "log-end-tag",
  getInboundSmsMessages: "get-inbound-sms-messages",
  getOutboundSmsMessageDeliveryReportsV3: "get-outbound-sms-message-delivery-reports-v3",
  getOutboundSmsMessageLogsV3: "get-outbound-sms-message-logs-v3",
  getOutboundSmsMessageDeliveryReports: "get-outbound-sms-message-delivery-reports",
  getOutboundSmsMessageLogs: "get-outbound-sms-message-logs",
};

// Load and parse OpenAPI specification
async function loadOpenAPISpec() {
  try {
    const specContent = await fs.readFile(OPENAPI_SPEC_PATH, "utf8");
    return JSON.parse(specContent);
  } catch (error) {
    console.warn("Could not load OpenAPI spec:", error.message);
    return null;
  }
}

// Extract parameters from OpenAPI specification for a given path and method
function extractOpenAPIParameters(spec, methodPath, httpMethod) {
  if (!spec || !spec.paths) return {};
  
  const pathSpec = spec.paths[methodPath];
  if (!pathSpec) return {};
  
  const operation = pathSpec[httpMethod.toLowerCase()];
  if (!operation) return {};
  
  const parameters = {
    pathParams: [],
    queryParams: [],
    bodyParams: {},
    bodySchema: null,
    examples: {},
  };
  
  // Extract path and query parameters
  if (operation.parameters) {
    operation.parameters.forEach(param => {
      if (param.in === "path") {
        parameters.pathParams.push({
          name: param.name,
          required: param.required || false,
          type: param.schema?.type || "string",
          description: param.description || "",
        });
      } else if (param.in === "query") {
        parameters.queryParams.push({
          name: param.name,
          required: param.required || false,
          type: param.schema?.type || "string",
          description: param.description || "",
          enum: param.schema?.enum || null,
        });
      }
    });
  }
  
  // Extract request body parameters and examples
  if (operation.requestBody) {
    const content = operation.requestBody.content;
    if (content && content["application/json"]) {
      const schema = content["application/json"].schema;
      parameters.bodySchema = schema;
      
      // Extract examples for better understanding of structure
      const examples = content["application/json"].examples;
      if (examples) {
        parameters.examples = examples;
      }
      
      // For SMS methods, extract specific structure from examples
      if (methodPath.includes("/sms") && examples) {
        const firstExample = Object.values(examples)[0];
        if (firstExample && firstExample.value) {
          parameters.exampleStructure = firstExample.value;
        }
      }
      
      // Extract properties from schema
      if (schema && schema.properties) {
        extractSchemaProperties(schema.properties, parameters.bodyParams, "");
      }
    }
  }
  
  return parameters;
}

// Recursively extract properties from JSON schema
function extractSchemaProperties(properties, result, prefix = "") {
  for (const [key, prop] of Object.entries(properties)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (prop.type === "object" && prop.properties) {
      extractSchemaProperties(prop.properties, result, fullKey);
    } else if (prop.type === "array" && prop.items && prop.items.properties) {
      extractSchemaProperties(prop.items.properties, result, `${fullKey}[]`);
    } else {
      result[fullKey] = {
        type: prop.type || "string",
        description: prop.description || "",
        required: false, // Will be set based on parent schema's required array
        enum: prop.enum || null,
        example: prop.example || null,
      };
    }
  }
}

// Map method names to their OpenAPI paths and HTTP methods
const METHOD_TO_OPENAPI_MAP = {
  sendSmsMessages: { path: "/sms/3/messages", method: "POST" },
  sendSmsMessagesOverQueryParameters: { path: "/sms/3/text/query", method: "GET" },
  sendSmsMessageOverQueryParameters: { path: "/sms/1/text/query", method: "GET" },
  previewSmsMessage: { path: "/sms/1/preview", method: "POST" },
  sendSmsMessage: { path: "/sms/2/text/advanced", method: "POST" },
  sendBinarySmsMessage: { path: "/sms/2/binary/advanced", method: "POST" },
  getScheduledSmsMessages: { path: "/sms/1/bulks", method: "GET" },
  rescheduleSmsMessages: { path: "/sms/1/bulks", method: "PUT" },
  getScheduledSmsMessagesStatus: { path: "/sms/1/bulks/status", method: "GET" },
  updateScheduledSmsMessagesStatus: { path: "/sms/1/bulks/status", method: "PUT" },
  logEndTag: { path: "/ct/1/log/end/{messageId}", method: "POST" },
  getInboundSmsMessages: { path: "/sms/1/inbox/reports", method: "GET" },
  getOutboundSmsMessageDeliveryReportsV3: { path: "/sms/3/reports", method: "GET" },
  getOutboundSmsMessageLogsV3: { path: "/sms/3/logs", method: "GET" },
  getOutboundSmsMessageDeliveryReports: { path: "/sms/1/reports", method: "GET" },
  getOutboundSmsMessageLogs: { path: "/sms/1/logs", method: "GET" },
};

// Map method names to kebab-case for action keys
function methodNameToKebabCase(methodName) {
  return methodName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

// Extract JSDoc comment and method signature from method text
function parseMethodInfo(methodText) {
  const jsdocMatch = methodText.match(/\/\*\*([\s\S]*?)\*\//);
  const methodMatch = methodText.match(/(\w+)\(opts = {}\)/);

  if (!jsdocMatch || !methodMatch) return null;

  const jsdoc = jsdocMatch[1];
  const methodName = methodMatch[1];

  // Extract summary (first non-empty line)
  const summaryMatch = jsdoc.match(/\*\s*([^\n\r@]+)/);
  const summary = summaryMatch
    ? summaryMatch[1].trim()
    : "";

  // Extract description (everything before @see or @param)
  const descMatch = jsdoc.match(/\*\s*([\s\S]*?)(?:\*\s*@see|\*\s*@param|\*\/)/);
  let description = descMatch
    ? descMatch[1].replace(/\*\s*/g, "").replace(/\s+/g, " ")
      .trim()
    : "";

  // Clean up description - remove extra whitespace and line breaks
  description = description.replace(/\n/g, " ").replace(/\s+/g, " ")
    .trim();

  // Extract external documentation link
  const seeMatch = jsdoc.match(/@see\s*\{@link\s*(.*?)\|/);
  const externalDoc = seeMatch
    ? seeMatch[1]
    : "https://www.infobip.com/docs/api";

  // Extract parameter info from @param annotation
  const paramMatch = jsdoc.match(/@param\s*\{\{([\s\S]*?)\}\}/);
  let hasData = false;
  let hasPathParams = false;
  let hasPathQuery = false;
  let paramDetails = {};

  if (paramMatch) {
    const paramText = paramMatch[1];
    hasData = paramText.includes("data?:") && (paramText.includes("required") || paramText.includes("Request body"));
    hasPathParams = paramText.includes("pathParams");
    hasPathQuery = paramText.includes("pathQuery");

    // Extract specific parameter details for better prop generation
    paramDetails = {
      hasData,
      hasPathParams,
      hasPathQuery,
      requiresPhoneNumber: hasData && (paramText.includes("\"to\"") || paramText.includes("destinations")),
      requiresText: hasData && paramText.includes("\"text\""),
      requiresFrom: hasData && paramText.includes("\"from\""),
      hasMessageId: hasPathParams && paramText.includes("messageId"),
      hasQueryParams: hasPathQuery && (paramText.includes("limit") || paramText.includes("query")),
      isRequired: paramText.includes("required"),
      hasApplicationId: hasData && paramText.includes("applicationId"),
      hasEntityId: hasData && paramText.includes("entityId"),
    };
  }

  return {
    methodName,
    summary,
    description,
    externalDoc,
    hasData,
    hasPathParams,
    hasPathQuery,
    paramDetails,
  };
}

// Generate props based on OpenAPI parameters
function generateProps(methodInfo, openApiParams) {
  const props = ["infobip"];
  
  // Add path parameters
  if (openApiParams?.pathParams) {
    openApiParams.pathParams.forEach(param => {
      let propDef;
      if (param.name === "messageId") {
        propDef = `
    ${param.name}: {
      propDefinition: [infobip, "messageId"],
      optional: ${!param.required},
    }`;
      } else {
        propDef = `
    ${param.name}: {
      type: "${param.type}",
      label: "${param.name.charAt(0).toUpperCase() + param.name.slice(1)}",
      description: "${param.description || `${param.name} parameter`}",
      optional: ${!param.required},
    }`;
      }
      props.push(propDef);
    });
  }
  
  // Add query parameters
  if (openApiParams?.queryParams) {
    openApiParams.queryParams.forEach(param => {
      let propDef;
      const typeMapping = {
        integer: "integer",
        number: "number", 
        boolean: "boolean",
        string: "string",
      };
      
      propDef = `
    ${param.name}: {
      type: "${typeMapping[param.type] || "string"}",
      label: "${param.name.charAt(0).toUpperCase() + param.name.slice(1).replace(/([A-Z])/g, ' $1')}",
      description: "${param.description || `${param.name} parameter`}",
      optional: ${!param.required},`;
      
      if (param.enum) {
        propDef += `
      options: ${JSON.stringify(param.enum)},`;
      }
      
      propDef += `
    }`;
      props.push(propDef);
    });
  }
  
  // For SMS sending methods, add required props based on OpenAPI examples structure
  if (methodInfo.methodName.includes("send") && !methodInfo.methodName.includes("OverQueryParameters")) {
    // Check if this is an SMS endpoint by looking at the example structure
    const isSmsMethod = openApiParams?.exampleStructure?.messages;
    
    if (isSmsMethod) {
      // Add phone number (maps to destinations[].to)
      props.push(`
    phoneNumber: {
      propDefinition: [infobip, "phoneNumber"],
      optional: false,
    }`);
      
      // Add text (maps to content.text)
      props.push(`
    text: {
      propDefinition: [infobip, "text"],
      optional: false,
    }`);
      
      // Add sender (maps to sender field)
      props.push(`
    from: {
      propDefinition: [infobip, "from"],
      optional: true,
    }`);
      
      // Add application and entity IDs for platform features
      props.push(`
    applicationId: {
      propDefinition: [infobip, "applicationId"],
      optional: true,
    },
    entityId: {
      propDefinition: [infobip, "entityId"],
      optional: true,
    }`);
    }
  }
  
  // Add application and entity IDs for query parameter sending methods
  if (methodInfo.methodName.includes("send") && methodInfo.methodName.includes("OverQueryParameters")) {
    props.push(`
    applicationId: {
      propDefinition: [infobip, "applicationId"],
      optional: true,
    },
    entityId: {
      propDefinition: [infobip, "entityId"],
      optional: true,
    }`);
  }
  
  // Add additional body parameters as generic props (skip SMS-specific ones we already handled)
  if (openApiParams?.bodyParams) {
    const skipParams = new Set(['messages', 'to', 'text', 'from', 'applicationId', 'entityId', 'sender', 'destinations', 'content']);
    
    Object.entries(openApiParams.bodyParams).forEach(([key, param]) => {
      // Skip array notation and already handled params
      if (key.includes('[]') || skipParams.has(key)) return;
      
      const typeMapping = {
        integer: "integer",
        number: "number", 
        boolean: "boolean",
        string: "string",
        object: "object",
        array: "string[]",
      };
      
      const propDef = `
    ${key}: {
      type: "${typeMapping[param.type] || "string"}",
      label: "${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}",
      description: "${param.description || `${key} parameter`}",
      optional: ${!param.required},${param.example ? `
      default: ${JSON.stringify(param.example)},` : ''}
    }`;
      props.push(propDef);
    });
  }

  return props.join(",");
}

// Generate the run method based on OpenAPI parameters
function generateRunMethod(methodInfo, openApiParams) {
  const { methodName } = methodInfo;
  
  let destructuring = "const { infobip";
  let methodCall = "";
  
  // Collect all parameter names for destructuring
  const paramNames = new Set();
  
  // Add path parameters
  if (openApiParams?.pathParams) {
    openApiParams.pathParams.forEach(param => {
      paramNames.add(param.name);
    });
  }
  
  // Add query parameters
  if (openApiParams?.queryParams) {
    openApiParams.queryParams.forEach(param => {
      paramNames.add(param.name);
    });
  }
  
  // Add SMS-specific parameters for sending methods (based on OpenAPI structure)
  if (methodName.includes("send") && !methodName.includes("OverQueryParameters") && openApiParams?.exampleStructure) {
    const isSmsMethod = openApiParams.exampleStructure.messages;
    if (isSmsMethod) {
      paramNames.add("phoneNumber");
      paramNames.add("text");
      paramNames.add("from");
      paramNames.add("applicationId");
      paramNames.add("entityId");
    }
  }
  
  // Add other body parameters
  if (openApiParams?.bodyParams) {
    const skipParams = new Set(['messages', 'to', 'text', 'from', 'applicationId', 'entityId']);
    Object.keys(openApiParams.bodyParams).forEach(key => {
      if (!key.includes('[]') && !skipParams.has(key)) {
        paramNames.add(key);
      }
    });
  }
  
  // Build destructuring assignment
  if (paramNames.size > 0) {
    destructuring += ", " + Array.from(paramNames).join(", ");
  }
  destructuring += ", ...params } = this;";
  
  // Generate method call based on method type
  if (openApiParams?.pathParams && openApiParams.pathParams.length > 0) {
    // Method with path parameters
    const pathParamsCode = openApiParams.pathParams
      .map(param => `{ name: "${param.name}", value: ${param.name} }`)
      .join(", ");
    
    methodCall = `
    const response = await infobip.${methodName}({
      $,
      pathParams: [${pathParamsCode}],${openApiParams.queryParams && openApiParams.queryParams.length > 0 ? `
      pathQuery: Object.entries({ ${openApiParams.queryParams.map(p => p.name).join(", ")} })
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => ({ name: key, value: value.toString() })),` : ''}
    });`;
  } else if (methodName.includes("send") && !methodName.includes("OverQueryParameters") && openApiParams?.exampleStructure) {
    // SMS sending methods with structured data based on OpenAPI examples
    const hasMessagesArray = openApiParams.exampleStructure.messages;
    const apiPath = METHOD_TO_OPENAPI_MAP[methodName]?.path || "";
    const isV3Api = apiPath.includes("/sms/3/");
    const isV2Api = apiPath.includes("/sms/2/");
    
    if (hasMessagesArray && isV3Api) {
      // Use correct structure for SMS v3 API (/sms/3/messages)
      methodCall = `
    const response = await infobip.${methodName}({
      $,
      data: {
        messages: [
          {
            ...(from && { sender: from }),
            destinations: [{ to: phoneNumber }],
            content: { text },
            ...(applicationId && { applicationId }),
            ...(entityId && { entityId }),
          },
        ],
        ...params,
      },
    });`;
    } else if (hasMessagesArray && (isV2Api || methodName.includes("sendSmsMessage"))) {
      // Use correct structure for SMS v2 API (/sms/2/text/advanced)
      methodCall = `
    const response = await infobip.${methodName}({
      $,
      data: {
        messages: [
          {
            destinations: [{ to: phoneNumber }],
            ...(from && { from }),
            text,
            ...(applicationId && { applicationId }),
            ...(entityId && { entityId }),
          },
        ],
        ...params,
      },
    });`;
    } else {
      // Fallback for other SMS methods without messages array
      methodCall = `
    const response = await infobip.${methodName}({
      $,
      data: {
        to: phoneNumber,
        text,
        ...(from && { from }),
        ...(applicationId && { applicationId }),
        ...(entityId && { entityId }),
        ...params,
      },
    });`;
    }
  } else if (openApiParams?.queryParams && openApiParams.queryParams.length > 0) {
    // Method with query parameters
    const queryParamNames = openApiParams.queryParams.map(p => p.name);
    methodCall = `
    const pathQuery = [];
    ${queryParamNames.map(name => `if (${name} !== undefined && ${name} !== null) pathQuery.push({ name: "${name}", value: ${name}.toString() });`).join('\n    ')}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.${methodName}({
      $,
      pathQuery: pathQuery.length > 0 ? pathQuery : undefined,
    });`;
  } else if (openApiParams?.bodyParams && Object.keys(openApiParams.bodyParams).length > 0) {
    // Method with body parameters
    methodCall = `
    const response = await infobip.${methodName}({
      $,
      data: {
        ${Array.from(paramNames).filter(name => !['infobip'].includes(name)).map(name => `...(${name} !== undefined && { ${name} }),`).join('\n        ')}
        ...params,
      },
    });`;
  } else {
    // Simple method with no specific parameters
    methodCall = `
    const response = await infobip.${methodName}({ $ });`;
  }

  // Generate summary based on method type
  let summary = "Action completed";
  if (methodName.includes("send")) {
    summary = "Message sent successfully";
  } else if (methodName.includes("get")) {
    summary = "Data retrieved successfully";
  } else if (methodName.includes("preview")) {
    summary = "Preview generated successfully";
  } else if (methodName.includes("reschedule") || methodName.includes("update")) {
    summary = "Update completed successfully";
  } else if (methodName.includes("logEndTag")) {
    summary = "Conversion logged successfully";
  }

  return `
  async run({ $ }) {
    ${destructuring}
${methodCall}

    $.export(
      "$summary",
      \`${summary}: \${response.status?.description || "Success"}\`
    );
    return response;
  },`;
}

// Generate complete action file content using OpenAPI parameters
function generateActionFile(methodInfo, openApiParams) {
  const actionName = METHOD_NAME_MAP[methodInfo.methodName] || methodInfo.summary;
  const actionKey = METHOD_TO_ACTION_KEY_MAP[methodInfo.methodName] || methodNameToKebabCase(methodInfo.methodName);
  const props = generateProps(methodInfo, openApiParams);
  const runMethod = generateRunMethod(methodInfo, openApiParams);

  let description = methodInfo.description;
  if (description.length > 200) {
    description = description.substring(0, 197) + "...";
  }

  return `import infobip from "${ACTION_TEMPLATE_PATH}";

export default {
  key: "${actionKey}",
  name: "${actionName}",
  description:
    "${description} [See the documentation](${methodInfo.externalDoc})",
  version: "0.0.1",
  type: "action",
  props: {
    ${props}
  },${runMethod}
};
`;
}

// Scan existing actions directory to identify what's already created
async function scanExistingActions() {
  const existingActions = new Set();

  try {
    const actionDirs = await fs.readdir(ACTIONS_DIR, {
      withFileTypes: true,
    });

    for (const dirent of actionDirs) {
      if (dirent.isDirectory()) {
        // Check both old and new naming schemes
        if (dirent.name.startsWith("infobip-")) {
          // Old naming scheme: infobip-get-inbound-sms-messages
          const actionName = dirent.name.replace("infobip-", "");
          const methodName = actionName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          existingActions.add(methodName);
        } else {
          // New naming scheme: get-inbound-sms-messages
          // Find the method name that maps to this action key
          for (const [methodName, actionKey] of Object.entries(METHOD_TO_ACTION_KEY_MAP)) {
            if (actionKey === dirent.name) {
              existingActions.add(methodName);
              break;
            }
          }
          
          // Fallback: convert kebab-case back to camelCase
          if (!Array.from(existingActions).find(method => METHOD_TO_ACTION_KEY_MAP[method] === dirent.name)) {
            const methodName = dirent.name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            existingActions.add(methodName);
          }
        }
      }
    }
  } catch (error) {
    console.warn("Could not scan actions directory:", error.message);
  }

  return existingActions;
}

// Extract methods from the enhanced app file
async function extractMethods() {
  try {
    const content = await fs.readFile(ENHANCED_APP_PATH, "utf8");
    const existingActions = await scanExistingActions();

    // Find the methods section
    const methodsMatch = content.match(/methods:\s*{([\s\S]*?)},\s*};/);
    if (!methodsMatch) {
      throw new Error("Could not find methods section in enhanced app file");
    }

    const methodsContent = methodsMatch[1];

    // Extract individual methods with their JSDoc comments
    const methodPattern = /\/\*\*([\s\S]*?)\*\/[\s\S]*?(\w+)\(opts = {}\)\s*{[\s\S]*?(?=\n {4}[\w\\/]|\n {2}},|$)/g;
    const methods = [];
    let regexMatch;

    while ((regexMatch = methodPattern.exec(methodsContent)) !== null) {
      const fullMethodText = regexMatch[0];
      const methodInfo = parseMethodInfo(fullMethodText);

      if (methodInfo &&
          !SKIP_METHODS.has(methodInfo.methodName) &&
          !existingActions.has(methodInfo.methodName)) {
        methods.push(methodInfo);
      }
    }

    return methods;
  } catch (error) {
    console.error("Error extracting methods:", error.message);
    return [];
  }
}

// Create action directory and file with proper error handling
async function createActionFile(methodInfo, openApiSpec) {
  const actionKey = METHOD_TO_ACTION_KEY_MAP[methodInfo.methodName] || methodNameToKebabCase(methodInfo.methodName);
  const actionDir = path.join(ACTIONS_DIR, actionKey);
  const actionFile = path.join(actionDir, `${actionKey}.mjs`);

  try {
    // Validate method info
    if (!methodInfo.methodName || !methodInfo.summary) {
      throw new Error("Invalid method info: missing required fields");
    }

    // Extract OpenAPI parameters for this method
    let openApiParams = {};
    if (openApiSpec && METHOD_TO_OPENAPI_MAP[methodInfo.methodName]) {
      const { path: apiPath, method: httpMethod } = METHOD_TO_OPENAPI_MAP[methodInfo.methodName];
      openApiParams = extractOpenAPIParameters(openApiSpec, apiPath, httpMethod);
      console.log(`📋 Extracted OpenAPI params for ${methodInfo.methodName}:`, {
        pathParams: openApiParams.pathParams?.length || 0,
        queryParams: openApiParams.queryParams?.length || 0,
        bodyParams: Object.keys(openApiParams.bodyParams || {}).length,
      });
    }

    // Create directory if it doesn't exist
    await fs.mkdir(actionDir, {
      recursive: true,
    });

    // Generate and write action file
    const actionContent = generateActionFile(methodInfo, openApiParams);

    // Validate generated content
    if (!actionContent || actionContent.trim().length === 0) {
      throw new Error("Generated action content is empty");
    }

    await fs.writeFile(actionFile, actionContent, "utf8");

    console.log(`✅ Created action: ${path.relative(process.cwd(), actionFile)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create action for ${actionKey}:`, error.message);
    return false;
  }
}

// Main execution function
async function generateActions() {
  console.log("🚀 Starting Infobip action generation with OpenAPI parameter extraction...\n");

  try {
    // Load OpenAPI specification
    console.log("📖 Loading OpenAPI specification...");
    const openApiSpec = await loadOpenAPISpec();
    if (openApiSpec) {
      console.log(`✅ Loaded OpenAPI spec version ${openApiSpec.info?.version || 'unknown'}\n`);
    } else {
      console.log("⚠️  Could not load OpenAPI spec, using fallback method detection\n");
    }

    // Extract methods from enhanced app
    const methods = await extractMethods();

    if (methods.length === 0) {
      console.log("✅ No new methods found to generate actions for. All methods already have corresponding actions.");
      return;
    }

    console.log(`Found ${methods.length} methods to generate actions for:\n`);

    methods.forEach((method) => {
      const actionKey = METHOD_TO_ACTION_KEY_MAP[method.methodName] || methodNameToKebabCase(method.methodName);
      const hasOpenApiMapping = METHOD_TO_OPENAPI_MAP[method.methodName] ? "🔗" : "📝";
      console.log(`  ${hasOpenApiMapping} ${method.methodName} → ${actionKey}`);
    });

    console.log("\n📝 Generating action files with explicit parameters...\n");

    // Generate actions
    let successCount = 0;
    const errors = [];

    for (const method of methods) {
      try {
        const success = await createActionFile(method, openApiSpec);
        if (success) {
          successCount++;
        } else {
          errors.push(`Failed to create action for ${method.methodName}`);
        }
      } catch (error) {
        errors.push(`Error creating action for ${method.methodName}: ${error.message}`);
      }
    }

    console.log("\n✨ Action generation complete!");
    console.log(`📊 Summary: ${successCount}/${methods.length} actions created successfully`);

    if (errors.length > 0) {
      console.log("\n⚠️  Errors encountered:");
      errors.forEach((error) => console.log(`  - ${error}`));
    }

    if (successCount > 0) {
      console.log("\n🔧 Next steps:");
      console.log("  1. Review the generated action files");
      console.log("  2. Run ESLint to fix any formatting issues: npm run lint");
      console.log("  3. Test the actions in your Pipedream workspace");
      console.log("  4. Update descriptions and props as needed");
    }
  } catch (error) {
    console.error("❌ Fatal error during action generation:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateActions().catch(console.error);
}

export {
  generateActions,
};
