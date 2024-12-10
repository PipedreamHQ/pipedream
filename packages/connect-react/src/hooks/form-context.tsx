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

export type DynamicProps<T extends ConfigurableProps> = { id: string; configurableProps: T; }; // TODO

export type FormContext<T extends ConfigurableProps> = {
  component: V1Component<T>;
  configurableProps: T; // dynamicProps.configurableProps || props.component.configurable_props
  configuredProps: ConfiguredProps<T>;
  dynamicProps?: DynamicProps<T>; // lots of calls require dynamicProps?.id, so need to expose
  dynamicPropsQueryIsFetching?: boolean;
  id: string;
  isValid: boolean;
  optionalPropIsEnabled: (prop: ConfigurableProp) => boolean;
  optionalPropSetEnabled: (prop: ConfigurableProp, enabled: boolean) => void;
  props: ComponentFormProps<T>;
  queryDisabledIdx?: number;
  setConfiguredProp: (idx: number, value: unknown) => void; // XXX type safety for value (T will rarely be static right?)
  setSubmitting: (submitting: boolean) => void;
  submitting: boolean;
  userId: string;
};

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
    component, configuredProps: __configuredProps, propNames, userId,
  } = formProps;
  const componentId = component.key;

  const [
    queryDisabledIdx,
    setQueryDisabledIdx,
  ] = useState<number | undefined>(0);
  const [
    submitting,
    setSubmitting,
  ] = useState(false);
  const [
    errors,
    setErrors,
  ] = useState<Record<string, string[]>>({});

  const [
    enabledOptionalProps,
    setEnabledOptionalProps,
  ] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setEnabledOptionalProps({});
  }, [
    component,
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
  const {
    isFetching: dynamicPropsQueryIsFetching,
    // TODO error
  } = useQuery({
    queryKey: [
      "dynamicProps",
    ],
    queryFn: async () => {
      const { dynamicProps } = await client.componentReloadProps(componentReloadPropsInput);
      // XXX what about if null?
      // TODO observation errors, etc.
      if (dynamicProps) {
        setDynamicProps(dynamicProps);
      }
      setReloadPropIdx(undefined);
      return []; // XXX ok to mutate above and not look at data?
    },
    enabled: reloadPropIdx != null, // TODO or props.dynamicPropsId && !dynamicProps
  });

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
    if (value === undefined) {
      if (!prop.optional) {
        errs.push("required");
      }
    } else if (prop.type === "integer") { // XXX type should be "number"? we don't support floats otherwise...
      if (typeof value !== "number") {
        errs.push("not a number");
      } else {
        if (prop.min != null && value < prop.min) {
          errs.push("number too small");
        }
        if (prop.max != null && value > prop.max) {
          errs.push("number too big");
        }
      }
    } else if (prop.type === "boolean") {
      if (typeof value !== "boolean") {
        errs.push("not a boolean");
      }
    } else if (prop.type === "string") {
      if (typeof value !== "string") {
        errs.push("not a string");
      }
    } else if (prop.type === "app") {
      // TODO need to know about auth type
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
    const newConfiguredProps: ConfiguredProps<T> = {};
    for (const prop of configurableProps) {
      if (prop.hidden) {
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
    } else if ("default" in prop && prop.default != null) {
      setConfiguredProp(idx, prop.default);
    }
    setEnabledOptionalProps(newEnabledOptionalProps);
  };

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
    optionalPropIsEnabled,
    optionalPropSetEnabled,
    queryDisabledIdx,
    setConfiguredProp,
    setSubmitting,
    submitting,
  };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
