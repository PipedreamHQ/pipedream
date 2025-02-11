import {
  createContext, useContext, useEffect, useId, useState, type ReactNode,
} from "react";
import isEqual from "lodash.isequal";
import { useQuery } from "@tanstack/react-query";
import type {
  ComponentReloadPropsOpts, ConfigurableProp, ConfigurableProps, ConfiguredProps, V1Component,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";
import type { ComponentFormProps } from "../components/ComponentForm";
import type { FormFieldContext } from "./form-field-context";
import {
  appPropErrors, arrayPropErrors, booleanPropErrors, integerPropErrors,
  stringPropErrors,
} from "../utils/component";
import _ from "lodash";
import {
  Observation, SdkError,
} from "../types";

export type DynamicProps<T extends ConfigurableProps> = { id: string; configurableProps: T; }; // TODO

export type FormContext<T extends ConfigurableProps> = {
  component: V1Component<T>;
  configurableProps: T; // dynamicProps.configurableProps || props.component.configurable_props
  configuredProps: ConfiguredProps<T>;
  dynamicProps?: DynamicProps<T>; // lots of calls require dynamicProps?.id, so need to expose
  dynamicPropsQueryIsFetching?: boolean;
  errors: Record<string, string[]>;
  sdkErrors: SdkError[];
  fields: Record<string, FormFieldContext<ConfigurableProp>>;
  id: string;
  isValid: boolean;
  optionalPropIsEnabled: (prop: ConfigurableProp) => boolean;
  optionalPropSetEnabled: (prop: ConfigurableProp, enabled: boolean) => void;
  props: ComponentFormProps<T>;
  propsNeedConfiguring: string[];
  queryDisabledIdx?: number;
  registerField: <T extends ConfigurableProp>(field: FormFieldContext<T>) => void;
  setConfiguredProp: (idx: number, value: unknown) => void; // XXX type safety for value (T will rarely be static right?)
  setSubmitting: (submitting: boolean) => void;
  submitting: boolean;
  userId: string;
  enableDebugging?: boolean;
};

export const skippablePropTypes = [
  "$.service.db",
  "$.interface.http",
  "$.interface.apphook",
  "$.interface.timer", // TODO add support for this (cron string and timers)
]

export const FormContext = createContext<FormContext<any /* XXX fix */> | undefined>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    // TODO: Improve error using hook/component names once we finalize them
    throw new Error("Must be used inside provider");
  }

  return context;
};

type FormContextProviderProps<T extends ConfigurableProps> = {
  children: ReactNode;
} & {
  props: ComponentFormProps<T>;
};

export const FormContextProvider = <T extends ConfigurableProps>({
  children, props: formProps,
}: FormContextProviderProps<T>) => {
  const client = useFrontendClient();

  const id = useId();

  const {
    component, configuredProps: __configuredProps, propNames, userId, sdkResponse, enableDebugging,
  } = formProps;
  const componentId = component.key;

  const [
    queryDisabledIdx,
    setQueryDisabledIdx,
  ] = useState<number | undefined>(0);
  const [
    fields,
    setFields,
  ] = useState<Record<string, FormFieldContext<ConfigurableProp>>>({});
  const [
    submitting,
    setSubmitting,
  ] = useState(false);
  const [
    errors,
    setErrors,
  ] = useState<Record<string, string[]>>({});

  const [
    sdkErrors,
    setSdkErrors,
  ] = useState<SdkError[]>([])

  const [
    enabledOptionalProps,
    setEnabledOptionalProps,
  ] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setEnabledOptionalProps({});
  }, [
    component.key,
  ]);
  // XXX pass this down? (in case we make it hash or set backed, but then also provide {add,remove} instead of set)
  const optionalPropIsEnabled = (prop: ConfigurableProp) => enabledOptionalProps[prop.name];

  let configuredProps = __configuredProps || {} as ConfiguredProps<T>;
  const [
    _configuredProps,
    _setConfiguredProps,
  ] = useState(configuredProps);
  const setConfiguredProps = formProps.onUpdateConfiguredProps || _setConfiguredProps;
  if (!formProps.onUpdateConfiguredProps) {
    configuredProps = _configuredProps;
  }

  const [
    dynamicProps,
    setDynamicProps,
  ] = useState<DynamicProps<T>>();
  const [
    reloadPropIdx,
    setReloadPropIdx,
  ] = useState<number>();
  const componentReloadPropsInput: ComponentReloadPropsOpts = {
    userId,
    componentId,
    configuredProps,
    dynamicPropsId: dynamicProps?.id,
  };
  const queryKeyInput = {
    ...componentReloadPropsInput,
  }

  const {
    isFetching: dynamicPropsQueryIsFetching,
    // TODO error
  } = useQuery({
    queryKey: [
      "dynamicProps",
      queryKeyInput,
    ],
    queryFn: async () => {
      const result = await client.componentReloadProps(componentReloadPropsInput);
      const {
        dynamicProps, observations, errors: __errors,
      } = result

      // Prioritize errors from observations over the errors array
      if (observations && observations.filter((o) => o.k === "error").length > 0) {
        handleSdkErrors(observations)
      } else {
        handleSdkErrors(__errors)
      }

      // XXX what about if null?
      // TODO observation errors, etc.
      if (dynamicProps) {
        formProps.onUpdateDynamicProps?.(dynamicProps);
        setDynamicProps(dynamicProps);
      }
      setReloadPropIdx(undefined);
      return []; // XXX ok to mutate above and not look at data?
    },
    enabled: reloadPropIdx != null, // TODO or props.dynamicPropsId && !dynamicProps
  });

  const [
    propsNeedConfiguring,
    setPropsNeedConfiguring,
  ] = useState<string[]>([]);
  useEffect(() => {
    checkPropsNeedConfiguring()
  }, [
    configuredProps,
  ]);

  // XXX fix types of dynamicProps, props.component so this type decl not needed
  let configurableProps: T = dynamicProps?.configurableProps || formProps.component.configurable_props || [];
  if (propNames?.length) {
    const _configurableProps = [];
    for (const prop of configurableProps) {
      // TODO decided propNames (and hideOptionalProps) should NOT filter dynamic props
      if (propNames.findIndex((name) => prop.name === name) >= 0) {
        _configurableProps.push(prop);
      }
    }
    configurableProps = _configurableProps as unknown as T; // XXX
  }
  if (reloadPropIdx != null) {
    configurableProps = configurableProps.slice(0, reloadPropIdx + 1) as unknown as T; // XXX
  }

  // these validations are necessary because they might override PropInput for number case for instance
  // so can't rely on that base control form validation
  const propErrors = (prop: ConfigurableProp, value: unknown): string[] => {
    const errs: string[] = [];
    if (prop.optional || prop.hidden || prop.disabled || skippablePropTypes.includes(prop.type)) return []
    if (prop.type === "app") {
      const field = fields[prop.name]
      if (field) {
        const app = field.extra.app
        errs.push(...(appPropErrors({
          prop,
          value,
          app,
        }) ?? []))
      } else {
        errs.push("field not registered")
      }
    } else if (prop.type === "boolean") {
      errs.push(...(booleanPropErrors({
        prop,
        value,
      }) ?? []))
    } else if (prop.type === "integer") {
      errs.push(...(integerPropErrors({
        prop,
        value,
      }) ?? []))
    } else if (prop.type === "string") {
      errs.push(...(stringPropErrors({
        prop,
        value,
      }) ?? []))
    } else if (prop.type === "string[]") {
      errs.push(...(arrayPropErrors({
        prop,
        value,
      }) ?? []))
    }
    return errs;
  };

  const updateConfiguredPropsQueryDisabledIdx = (configuredProps: ConfiguredProps<T>) => {
    let _queryDisabledIdx = undefined;
    for (let idx = 0; idx < configurableProps.length; idx++) {
      const prop = configurableProps[idx];
      if (prop.hidden || (prop.optional && !optionalPropIsEnabled(prop))) {
        continue;
      }
      const value = configuredProps[prop.name as keyof ConfiguredProps<T>];
      if (value === undefined && _queryDisabledIdx == null && (prop.type === "app" || prop.remoteOptions)) {
        _queryDisabledIdx = idx;
        break;
      }
    }
    setQueryDisabledIdx(_queryDisabledIdx);
  };

  // trusts they've been filtered to configurable props correctly already
  const updateConfiguredProps = (configuredProps: ConfiguredProps<T>) => {
    setConfiguredProps(configuredProps);
    updateConfiguredPropsQueryDisabledIdx(configuredProps);
    updateConfigurationErrors(configuredProps)
  };

  const updateConfigurationErrors = (configuredProps: ConfiguredProps<T>) => {
    const _errors: typeof errors = {};
    for (let idx = 0; idx < configurableProps.length; idx++) {
      const prop = configurableProps[idx];
      const value = configuredProps[prop.name as keyof ConfiguredProps<T>];
      const errs = propErrors(prop, value);
      if (errs.length) {
        _errors[prop.name] = errs;
      }
    }
    setErrors(_errors);
  };

  useEffect(() => {
    // Initialize queryDisabledIdx on load so that we don't force users
    // to reconfigure a prop they've already configured whenever the page
    // or component is reloaded
    updateConfiguredPropsQueryDisabledIdx(_configuredProps)
  }, [
    _configuredProps,
  ]);

  useEffect(() => {
    updateConfigurationErrors(configuredProps)
  }, [
    configuredProps,
    reloadPropIdx,
    queryDisabledIdx,
  ]);

  useEffect(() => {
    handleSdkErrors(sdkResponse)
  }, [
    sdkResponse,
  ]);

  useEffect(() => {
    const newConfiguredProps: ConfiguredProps<T> = {};
    for (const prop of configurableProps) {
      if (prop.hidden) {
        continue;
      }
      if (skippablePropTypes.includes(prop.type)) {
        continue;
      }
      // if prop.optional and not shown, we skip and do on un-collapse
      if (prop.optional && !optionalPropIsEnabled(prop)) {
        continue;
      }
      const value = configuredProps[prop.name as keyof ConfiguredProps<T>];
      if (value === undefined) {
        if ("default" in prop && prop.default != null) {
          newConfiguredProps[prop.name as keyof ConfiguredProps<T>] = prop.default;
        }
      } else {
        if (prop.type === "integer" && typeof value !== "number") {
          delete newConfiguredProps[prop.name as keyof ConfiguredProps<T>];
        } else {
          newConfiguredProps[prop.name as keyof ConfiguredProps<T>] = value;
        }
      }
    }
    if (!isEqual(newConfiguredProps, configuredProps)) {
      updateConfiguredProps(newConfiguredProps);
    }
  }, [
    configurableProps,
  ]);

  // clear all props on user change
  const [
    prevUserId,
    setPrevUserId,
  ] = useState(userId)
  useEffect(() => {
    if (prevUserId !== userId) {
      updateConfiguredProps({});
      setPrevUserId(userId)
    }
  }, [
    userId,
  ]);

  // maybe should take prop as first arg but for text inputs didn't want to compute index each time
  const setConfiguredProp = (idx: number, value: unknown) => {
    const prop = configurableProps[idx];
    const newConfiguredProps = {
      ...configuredProps,
    };
    if (value === undefined) {
      delete newConfiguredProps[prop.name as keyof ConfiguredProps<T>];
    } else {
      newConfiguredProps[prop.name as keyof ConfiguredProps<T>] = value as any /* XXX fix prop value type from T */; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    setConfiguredProps(newConfiguredProps);
    if (prop.reloadProps) {
      setReloadPropIdx(idx);
    }
    if (prop.type === "app" || prop.remoteOptions) {
      updateConfiguredPropsQueryDisabledIdx(newConfiguredProps);
    }
    const errs = propErrors(prop, value);
    const newErrors = {
      ...errors,
    };
    if (errs.length) {
      newErrors[prop.name] = errs;
    } else {
      delete newErrors[prop.name];
    }
    setErrors(newErrors);
  };

  const optionalPropSetEnabled = (prop: ConfigurableProp, enabled: boolean) => {
    const newEnabledOptionalProps = {
      ...enabledOptionalProps,
    };
    if (enabled) {
      newEnabledOptionalProps[prop.name] = true;
    } else {
      delete newEnabledOptionalProps[prop.name];
    }
    const idx = configurableProps.findIndex((p) => p.name === prop.name);
    if (!enabled) {
      setConfiguredProp(idx, undefined);
    } else if (__configuredProps?.[prop.name as keyof ConfiguredProps<T>] !== undefined) {
      setConfiguredProp(
        idx,
        __configuredProps[prop.name as keyof ConfiguredProps<T>],
      );
    } else if ("default" in prop && prop.default != null) {
      setConfiguredProp(idx, prop.default);
    }
    setEnabledOptionalProps(newEnabledOptionalProps);
  };

  const checkPropsNeedConfiguring = () => {
    const _propsNeedConfiguring = []
    for (const prop of configurableProps) {
      if (!prop || prop.optional || prop.hidden || skippablePropTypes.includes(prop.type)) continue
      const value = configuredProps[prop.name as keyof ConfiguredProps<T>]
      const errors = propErrors(prop, value)
      if (errors.length) {
        _propsNeedConfiguring.push(prop.name)
      }
    }
    // propsNeedConfiguring.splice(0, propsNeedConfiguring.length, ..._propsNeedConfiguring)

    // Prevent useEffect/useState infinite loop by updating
    // propsNeedConfiguring only if there is an actual change to the list of
    // props that need to be configured.
    // NB: The infinite loop is triggered because of calling
    // checkPropsNeedConfiguring() from registerField, which is called
    // from inside useEffect.
    if (_propsNeedConfiguring && propsNeedConfiguring && _.isEqual(_propsNeedConfiguring, propsNeedConfiguring)) return;

    setPropsNeedConfiguring(_propsNeedConfiguring)
  }

  const registerField = <T extends ConfigurableProp>(field: FormFieldContext<T>) => {
    setFields((fields) => {
      fields[field.prop.name] = field
      return fields
    });
    checkPropsNeedConfiguring()
  };

  const handleSdkErrors = (sdkResponse: unknown[] | unknown | undefined) => {
    if (!sdkResponse) return

    let newErrors = [
      ...sdkErrors,
    ]

    const errorFromString = (item: string, ret: SdkError[]) => {
      try {
        const json = JSON.parse(item)
        const err: SdkError = {
          name: json.name,
          message: json.message,
        }
        if (err.name && err.message) {
          ret.push(err)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // pass
      }
    }

    const errorFromObject = (item: unknown, ret: SdkError[]) => {
      const err: SdkError = {
        name: item.name,
        message: item.message,
      }
      if (err.name && err.message) {
        ret.push(err)
      }
    }

    const errorFromObservationError = (item: Error, ret: SdkError[]) => {
      const err: SdkError = {
        name: item.err?.name,
        message: item.err?.message,
      }
      if (err.name && err.message) {
        ret.push(err)
      }
    }

    const errorFromObservation = (payload: Observation, ret: SdkError[]) => {
      const os = payload.os || payload.observations
      if (Array.isArray(os) && os.length > 0) {
        for (let i = 0; i < os.length; i++) {
          if (os[i].k !== "error") continue
          errorFromObservationError(os[i], ret)
        }
      }
    }

    const errorFromDetails = (data: unknown, ret: SdkError[]) => {
      ret.push({
        name: data.error,
        message: JSON.stringify(data.details),
        //     message: ` // TODO: It would be nice to render the JSON in markdown
        // \`\`\`json
        // ${JSON.stringify(data.details)}
        // \`\`\`
        // `,
        //   })
      })
    }

    const errorFromHttpError = (payload: Error, ret: SdkError[]) => {
      // Handle HTTP errors thrown by the SDK
      try {
        const data = JSON.parse(payload.message)?.data
        if (data && "observations" in data) {
          errorFromObservation(data, ret)
        } else if (data && "error" in data && "details" in data) {
          errorFromDetails(data, ret)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // pass
      }
    }

    if (Array.isArray(sdkResponse) && sdkResponse.length > 0) {
      for (let i = 0; i < sdkResponse.length; i++) {
        const item = sdkResponse[i]
        if (typeof item === "string") {
          errorFromString(item, newErrors)
        } else if (typeof item === "object" && "name" in item && "message" in item) {
          errorFromObject(item, newErrors)
        } else if (typeof item === "object" && item.k === "error") {
          errorFromObservationError(item, newErrors)
        }
      }
    } else if (typeof sdkResponse === "object" && "os" in sdkResponse || "observations" in sdkResponse) {
      errorFromObservation(sdkResponse, newErrors)
    } else if (typeof sdkResponse === "object" && "message" in sdkResponse) {
      errorFromHttpError(sdkResponse, newErrors)
    } else {
      newErrors = []
    }
    setSdkErrors(newErrors)
  }

  // console.log("***", configurableProps, configuredProps)
  const value: FormContext<T> = {
    id,
    isValid: !Object.keys(errors).length, // XXX want to expose more from errors
    props: formProps,
    userId,
    component,
    configurableProps,
    configuredProps,
    dynamicProps,
    dynamicPropsQueryIsFetching,
    errors,
    fields,
    optionalPropIsEnabled,
    optionalPropSetEnabled,
    propsNeedConfiguring,
    queryDisabledIdx,
    registerField,
    setConfiguredProp,
    setSubmitting,
    submitting,
    sdkErrors,
    enableDebugging,
  };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
