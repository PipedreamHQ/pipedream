import type {
  ConfigurePropOpts, PropOptionValue,
} from "@pipedream/sdk";
import { useQuery } from "@tanstack/react-query";
import {
  useState, useEffect, useRef, useMemo,
} from "react";
import { useFormContext } from "../hooks/form-context";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useFrontendClient } from "../hooks/frontend-client-context";
import {
  ConfigureComponentContext, RawPropOption,
} from "../types";
import {
  isString, sanitizeOption,
} from "../utils/type-guards";
import { ControlSelect } from "./ControlSelect";

export type RemoteOptionsContainerProps = {
  queryEnabled?: boolean;
};

type ConfigurePropResult = {
  error: { name: string; message: string; } | undefined;
  options: RawPropOption[];
  context: ConfigureComponentContext | undefined;
};

export function RemoteOptionsContainer({ queryEnabled }: RemoteOptionsContainerProps) {
  const client = useFrontendClient();
  const {
    externalUserId,
    component,
    configurableProps,
    configuredProps,
    dynamicProps,
    props: { disableQueryDisabling },
  } = useFormContext();
  const {
    idx, prop, onChange,
  } = useFormFieldContext();

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState<number>(0);

  const [
    context,
    setContext,
  ] = useState<ConfigureComponentContext | undefined>(undefined);

  const [
    nextContext,
    setNextContext,
  ] = useState<ConfigureComponentContext | undefined>(undefined);

  const [
    canLoadMore,
    setCanLoadMore,
  ] = useState<boolean>(true);

  const [
    accumulatedData,
    setAccumulatedData,
  ] = useState<RawPropOption[]>([]);

  const [
    accumulatedValues,
    setAccumulatedValues,
  ] = useState<Set<PropOptionValue>>(new Set());

  // Memoize configured props up to current index
  const configuredPropsUpTo = useMemo(() => {
    const props: Record<string, unknown> = {};
    for (let i = 0; i < idx; i++) {
      const p = configurableProps[i];
      props[p.name] = configuredProps[p.name];
    }
    return props;
  }, [idx, configurableProps, configuredProps]);

  // Memoize account value for tracking changes
  const accountValue = useMemo(() => {
    const accountProp = configurableProps.find((p: any) => p.type === "app");
    return accountProp ? configuredProps[accountProp.name] : undefined;
  }, [configurableProps, configuredProps]);

  const componentConfigureInput: ConfigurePropOpts = useMemo(() => {
    const input: ConfigurePropOpts = {
      externalUserId,
      page,
      prevContext: context,
      id: component.key,
      propName: prop.name,
      configuredProps: configuredPropsUpTo,
      dynamicPropsId: dynamicProps?.id,
    };
    if (prop.useQuery) {
      input.query = query || "";
    }
    return input;
  }, [externalUserId, page, context, component.key, prop.name, prop.useQuery, configuredPropsUpTo, dynamicProps?.id, query]);

  // React Query key excludes dynamicPropsId
  const queryKeyInput = useMemo(() => {
    const {
      dynamicPropsId, ...rest
    } = componentConfigureInput;
    return rest;
  }, [componentConfigureInput]);

  const [
    error,
    setError,
  ] = useState<{ name: string; message: string; }>();

  const onLoadMore = () => {
    setPage(prev => prev + 1);
    setContext(nextContext);
  };

  // Track queryKey and account changes (need these before effects that use them)
  const queryKeyString = JSON.stringify(queryKeyInput);
  const accountKey = JSON.stringify(accountValue);
  const prevQueryKeyRef = useRef<string>();
  const prevAccountKeyRef = useRef<string>();

  // Check if there's an account prop - if so, it must be set for the query to be enabled
  const hasAccountProp = useMemo(() => {
    return configurableProps.some((p: any) => p.type === "app");
  }, [configurableProps]);

  const isQueryEnabled = useMemo(() => {
    if (!queryEnabled) return false;
    // If there's an account prop, it must be set
    if (hasAccountProp && !accountValue) return false;
    return true;
  }, [queryEnabled, hasAccountProp, accountValue]);

  // Fetch data without side effects - just return the raw response
  const {
    data: queryData, isFetching, refetch, dataUpdatedAt,
  } = useQuery<ConfigurePropResult>({
    queryKey: [
      "componentConfigure",
      queryKeyInput,
    ],
    queryFn: async (): Promise<ConfigurePropResult> => {
      const res = await client.components.configureProp(componentConfigureInput);

      const {
        options, stringOptions, errors,
      } = res;

      if (errors?.length) {
        let error;
        try {
          error = JSON.parse(errors[0]);
        } catch {
          error = {
            name: "Error",
            message: errors[0],
          };
        }
        return {
          error,
          options: [],
          context: res.context,
        };
      }

      let _options: RawPropOption[] = [];
      if (options?.length) {
        _options = options;
      }
      if (stringOptions?.length) {
        _options = stringOptions.map(str => ({
          label: str,
          value: str,
        }));
      }

      return {
        error: undefined,
        options: _options,
        context: res.context,
      };
    },
    enabled: isQueryEnabled,
  });

  // Sync query data into accumulated state
  useEffect(() => {
    if (!queryData) return;

    // Handle errors
    if (queryData.error) {
      setError(queryData.error);
      return;
    }

    setError(undefined);

    // Store the context for the next page
    setNextContext(queryData.context);

    // Determine if this is a fresh query or pagination
    const isFirstPage = page === 0;

    // Update values set
    setAccumulatedValues(prevValues => {
      const baseValues = isFirstPage ? new Set<PropOptionValue>() : prevValues;
      const newValues = new Set(baseValues);
      let hasNewOptions = false;

      for (const o of queryData.options) {
        let value: PropOptionValue;
        if (isString(o)) {
          value = o;
        } else if (o && typeof o === "object" && "value" in o && o.value != null) {
          value = o.value;
        } else {
          console.warn("Skipping invalid option:", o);
          continue;
        }

        if (!newValues.has(value)) {
          newValues.add(value);
          hasNewOptions = true;
        }
      }

      // Update canLoadMore flag
      if (!hasNewOptions) {
        setCanLoadMore(false);
      }

      return newValues;
    });

    // Update accumulated data independently
    setAccumulatedData(prevData => {
      const baseData = isFirstPage ? [] : prevData;
      const newOptions: RawPropOption[] = [];
      const tempValues = new Set<PropOptionValue>();

      // Build temp values set from existing data for deduplication
      if (!isFirstPage) {
        for (const o of baseData) {
          if (isString(o)) {
            tempValues.add(o);
          } else if (o && typeof o === "object" && "value" in o && o.value != null) {
            tempValues.add(o.value);
          }
        }
      }

      for (const o of queryData.options) {
        let value: PropOptionValue;
        if (isString(o)) {
          value = o;
        } else if (o && typeof o === "object" && "value" in o && o.value != null) {
          value = o.value;
        } else {
          continue;
        }

        if (!tempValues.has(value)) {
          tempValues.add(value);
          newOptions.push(o);
        }
      }

      if (!newOptions.length) {
        return prevData;
      }

      return [
        ...baseData,
        ...newOptions,
      ] as RawPropOption[];
    });
  }, [queryData, page, dataUpdatedAt, queryKeyString]);

  // Reset pagination when queryKey changes
  useEffect(() => {
    const queryKeyChanged = prevQueryKeyRef.current && prevQueryKeyRef.current !== queryKeyString;

    if (queryKeyChanged) {
      // Query params changed - reset pagination state
      // React Query will automatically refetch due to queryKey change
      setPage(0);
      setContext(undefined);
      setNextContext(undefined);
      setCanLoadMore(true);
      setAccumulatedData([]);
      setAccumulatedValues(new Set());
    }
    prevQueryKeyRef.current = queryKeyString;
  }, [queryKeyString]);

  // Separately track account changes to clear field value
  useEffect(() => {
    const accountChanged = prevAccountKeyRef.current && prevAccountKeyRef.current !== accountKey;

    if (accountChanged) {
      // Account changed - clear the field value
      onChange(undefined);

      // Always refetch when account changes to a non-null value
      // This handles cases like A -> null -> A where queryKey returns to a previous value
      if (accountValue != null && isQueryEnabled) {
        refetch();
      }
    }

    prevAccountKeyRef.current = accountKey;
  }, [accountKey, onChange, isQueryEnabled, accountValue, refetch]);

  const showLoadMoreButton = () => {
    return !isFetching && !error && canLoadMore
  }

  // TODO show error in different spot!
  const placeholder = error
    ? error.message
    : disableQueryDisabling
      ? "Click to configure"
      : !queryEnabled
        ? "Configure props above first"
        : undefined;
  const isDisabled = disableQueryDisabling
    ? false
    : !queryEnabled;

  return (
    <ControlSelect
      isCreatable={true}
      showLoadMoreButton={showLoadMoreButton()}
      onLoadMore={onLoadMore}
      options={accumulatedData.map(sanitizeOption)}
      // XXX isSearchable if pageQuery? or maybe in all cases? or maybe NOT when pageQuery
      selectProps={{
        isLoading: isFetching,
        placeholder,
        isDisabled,
        inputValue: prop.useQuery
          ? query
          : undefined,
        onInputChange(v) {
          if (prop.useQuery) {
            setQuery(v);
            refetch();
          }
        },
        onMenuOpen() {
          if (disableQueryDisabling && !isQueryEnabled) {
            refetch(); // TODO don't refetch if same exact params? (this is just for stress demo -- for now)
          }
        },
      }}
    />
  );
}
