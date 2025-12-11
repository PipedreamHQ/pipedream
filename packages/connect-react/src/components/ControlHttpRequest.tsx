import {
  useState, useEffect,
} from "react";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import {
  getInputStyles, getButtonStyles, getRemoveButtonStyles, getContainerStyles, getItemStyles,
} from "../styles/control-styles";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

type KeyValuePair = {
  key: string;
  value: string;
};

type HttpRequestState = {
  url: string;
  method: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  bodyContentType: string;
};

// This matches the schema expected by the Pipedream component runtime
// See: lambda-v2/packages/component-runtime/src/prepareProps/httpRequest.js
type HttpRequestValue = {
  url: string;
  method: string;
  headers: Array<{ name: string; value: string; disabled?: boolean }>;
  params: Array<{ name: string; value: string; disabled?: boolean }>;
  body: {
    contentType: string;
    type: "raw" | "fields";
    mode: "raw" | "fields";
    raw?: string;
    fields?: Array<{ name: string; value: string }>;
  };
  auth?: {
    type: "none" | "basic" | "bearer";
    username?: string;
    password?: string;
    token?: string;
  };
};

const BODY_CONTENT_TYPES = [
  {
    value: "application/json",
    label: "JSON",
  },
  {
    value: "application/x-www-form-urlencoded",
    label: "Form URL Encoded",
  },
  {
    value: "text/plain",
    label: "Text",
  },
  {
    value: "none",
    label: "None",
  },
] as const;

export function ControlHttpRequest() {
  const formFieldContextProps = useFormFieldContext();
  const {
    onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  // Get default values from prop definition
  const getDefaultConfig = () => {
    if ("default" in prop && prop.default && typeof prop.default === "object") {
      return prop.default as {
        url?: string;
        method?: string;
        headers?: Array<{ name: string; value: string }>;
        params?: Array<{ name: string; value: string }>;
        body?: { raw?: string; contentType?: string };
      };
    }
    return undefined;
  };

  // Initialize headers from value or defaults
  const initializeHeaders = (): KeyValuePair[] => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    const headers = currentValue?.headers ?? defaultConfig?.headers ?? [];

    if (headers.length === 0) {
      return [
        {
          key: "",
          value: "",
        },
      ];
    }

    return headers.map((h) => ({
      key: h.name ?? "",
      value: h.value ?? "",
    }));
  };

  // Initialize params from value or defaults
  const initializeParams = (): KeyValuePair[] => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    const params = currentValue?.params ?? defaultConfig?.params ?? [];

    if (params.length === 0) {
      return [
        {
          key: "",
          value: "",
        },
      ];
    }

    return params.map((p) => ({
      key: p.name ?? "",
      value: p.value ?? "",
    }));
  };

  // Initialize body from value or defaults
  const initializeBody = (): string => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    return currentValue?.body?.raw ?? defaultConfig?.body?.raw ?? "";
  };

  // Initialize body content type from value or defaults
  const initializeBodyContentType = (): string => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    return currentValue?.body?.contentType ?? defaultConfig?.body?.contentType ?? "application/json";
  };

  // Initialize state
  const initializeState = (): HttpRequestState => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    return {
      url: currentValue?.url ?? defaultConfig?.url ?? "",
      method: currentValue?.method ?? defaultConfig?.method ?? "GET",
      headers: initializeHeaders(),
      params: initializeParams(),
      body: initializeBody(),
      bodyContentType: initializeBodyContentType(),
    };
  };

  const [
    state,
    setState,
  ] = useState<HttpRequestState>(initializeState);

  // Update state when external value changes
  useEffect(() => {
    const currentValue = value as HttpRequestValue | undefined;
    const defaultConfig = getDefaultConfig();

    const newHeaders = currentValue?.headers ?? defaultConfig?.headers ?? [];
    const headers: KeyValuePair[] = newHeaders.length > 0
      ? newHeaders.map((h) => ({
        key: h.name ?? "",
        value: h.value ?? "",
      }))
      : [
        {
          key: "",
          value: "",
        },
      ];

    const newParams = currentValue?.params ?? defaultConfig?.params ?? [];
    const params: KeyValuePair[] = newParams.length > 0
      ? newParams.map((p) => ({
        key: p.name ?? "",
        value: p.value ?? "",
      }))
      : [
        {
          key: "",
          value: "",
        },
      ];

    setState({
      url: currentValue?.url ?? defaultConfig?.url ?? "",
      method: currentValue?.method ?? defaultConfig?.method ?? "GET",
      headers,
      params,
      body: currentValue?.body?.raw ?? defaultConfig?.body?.raw ?? "",
      bodyContentType: currentValue?.body?.contentType ?? defaultConfig?.body?.contentType ?? "application/json",
    });
  }, [
    value,
  ]);

  // Serialize state to output format that matches the backend schema
  // IMPORTANT: The backend requires headers and params to ALWAYS be arrays (even if empty)
  // See: lambda-v2/packages/component-runtime/src/prepareProps/httpRequest.js
  const serializeToOutput = (currentState: HttpRequestState): HttpRequestValue => {
    // Filter out empty headers but keep the array structure
    const validHeaders = currentState.headers
      .filter((h) => h.key.trim() !== "")
      .map((h) => ({
        name: h.key,
        value: h.value,
      }));

    // Filter out empty params but keep the array structure
    const validParams = currentState.params
      .filter((p) => p.key.trim() !== "")
      .map((p) => ({
        name: p.key,
        value: p.value,
      }));

    // Build body object - contentType is always required
    const body: HttpRequestValue["body"] = {
      contentType: currentState.bodyContentType,
      type: "raw",
      mode: "raw",
    };

    // Only include raw if there's content and contentType isn't "none"
    if (currentState.bodyContentType !== "none" && currentState.body.trim()) {
      body.raw = currentState.body;
    }

    const output: HttpRequestValue = {
      url: currentState.url,
      method: currentState.method,
      headers: validHeaders,  // Always an array, even if empty
      params: validParams,    // Always an array, even if empty
      body,
    };

    return output;
  };

  const handleUrlChange = (url: string) => {
    const newState = {
      ...state,
      url,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const handleMethodChange = (method: string) => {
    const newState = {
      ...state,
      method,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const handleHeaderChange = (index: number, field: "key" | "value", newValue: string) => {
    const newHeaders = [
      ...state.headers,
    ];
    newHeaders[index] = {
      ...newHeaders[index],
      [field]: newValue,
    };
    const newState = {
      ...state,
      headers: newHeaders,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const addHeader = () => {
    const newHeaders = [
      ...state.headers,
      {
        key: "",
        value: "",
      },
    ];
    setState({
      ...state,
      headers: newHeaders,
    });
  };

  const removeHeader = (index: number) => {
    const newHeaders = state.headers.filter((_, i) => i !== index);
    const finalHeaders = newHeaders.length > 0
      ? newHeaders
      : [
        {
          key: "",
          value: "",
        },
      ];
    const newState = {
      ...state,
      headers: finalHeaders,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const handleBodyContentTypeChange = (bodyContentType: string) => {
    const newState = {
      ...state,
      bodyContentType,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const handleBodyChange = (body: string) => {
    const newState = {
      ...state,
      body,
    };
    setState(newState);
    onChange(serializeToOutput(newState));
  };

  const containerStyles = getContainerStyles();
  const itemStyles = getItemStyles();
  const inputStyles = getInputStyles(theme);
  const buttonStyles = getButtonStyles(theme);
  const removeButtonStyles = getRemoveButtonStyles(theme);

  const sectionStyles = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: `${theme.spacing.baseUnit}px`,
  };

  const labelStyles = {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: theme.colors.neutral70,
  };

  const selectStyles = {
    ...inputStyles,
    cursor: "pointer" as const,
  };

  const methodSelectStyles = {
    ...inputStyles,
    cursor: "pointer" as const,
    flex: "none",
    width: "85px",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "none",
  };

  const urlInputStyles = {
    ...inputStyles,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flex: 1,
  };

  const textareaStyles = {
    ...inputStyles,
    resize: "vertical" as const,
    minHeight: "80px",
    fontFamily: "monospace",
  };

  const urlRowStyles = {
    display: "flex" as const,
    alignItems: "stretch" as const,
  };

  return (
    <div {...getProps("controlHttpRequest", containerStyles, formFieldContextProps)}>
      {/* URL + Method Section */}
      <div style={sectionStyles}>
        <label style={labelStyles}>URL</label>
        <div style={urlRowStyles}>
          <select
            value={state.method}
            onChange={(e) => handleMethodChange(e.target.value)}
            style={methodSelectStyles}
          >
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <input
            type="text"
            value={state.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            style={urlInputStyles}
            required={!prop.optional}
          />
        </div>
      </div>

      {/* Headers Section */}
      <div style={sectionStyles}>
        <label style={labelStyles}>Headers</label>
        {state.headers.map((header, index) => (
          <div key={index} style={itemStyles}>
            <input
              type="text"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
              placeholder="Header name"
              style={inputStyles}
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
              placeholder="Header value"
              style={inputStyles}
            />
            {state.headers.length > 1 && (
              <button
                type="button"
                onClick={() => removeHeader(index)}
                style={removeButtonStyles}
                aria-label="Remove header"
              >
                x
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addHeader}
          style={{
            ...buttonStyles,
            alignSelf: "flex-start",
            paddingRight: `${theme.spacing.baseUnit * 2}px`,
          }}
        >
          <span>+</span>
          <span>Add header</span>
        </button>
      </div>

      {/* Body Section */}
      <div style={sectionStyles}>
        <label style={labelStyles}>Body</label>
        <select
          value={state.bodyContentType}
          onChange={(e) => handleBodyContentTypeChange(e.target.value)}
          style={selectStyles}
        >
          {BODY_CONTENT_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>{ct.label}</option>
          ))}
        </select>
        {state.bodyContentType !== "none" && (
          <textarea
            value={state.body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder={state.bodyContentType === "application/json"
              ? "{\"key\": \"value\"}"
              : "Request body"}
            style={textareaStyles}
            rows={4}
          />
        )}
      </div>
    </div>
  );
}
