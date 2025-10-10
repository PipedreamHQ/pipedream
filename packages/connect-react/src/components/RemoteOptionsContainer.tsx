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
    canLoadMore,
    setCanLoadMore,
  ] = useState<boolean>(true);

  const [
    context,
    setContext,
  ] = useState<ConfigureComponentContext | undefined>(undefined);

  const [
    pageable,
    setPageable,
  ] = useState<{
    page: number;
    prevContext: ConfigureComponentContext | undefined;
    data: RawPropOption[];
    values: Set<PropOptionValue>;
  }>({
    page: 0,
    prevContext: {},
    data: [],
    values: new Set(),
  })

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
    setPage(pageable.page)
    setContext(pageable.prevContext)
    setPageable({
      ...pageable,
      prevContext: {},
    })
  }

  // TODO handle error!
  const {
    isFetching, refetch,
  } = useQuery({
    queryKey: [
      "componentConfigure",
      queryKeyInput,
    ],
    staleTime: 0, // Always refetch, don't use cached data
    queryFn: async () => {
      setError(undefined);
      const res = await client.components.configureProp(componentConfigureInput);

      // XXX look at errors in response here too
      const {
        options, stringOptions, errors,
      } = res;

      if (errors?.length) {
        // TODO field context setError? (for validity, etc.)
        try {
          setError(JSON.parse(errors[0]));
        } catch {
          setError({
            name: "Error",
            message: errors[0],
          });
        }
        return [];
      }
      let _options: RawPropOption[] = []
      if (options?.length) {
        _options = options;
      }
      if (stringOptions?.length) {
        const options = [];
        for (const stringOption of stringOptions) {
          options.push({
            label: stringOption,
            value: stringOption,
          });
        }
        _options = options;
      }

      // If page is 0, this is a fresh query - start with empty data
      const isFirstPage = page === 0;
      const baseData = isFirstPage ? [] : pageable.data;
      const baseValues = isFirstPage ? new Set<PropOptionValue>() : pageable.values;

      const newOptions = []
      const allValues = new Set(baseValues)
      for (const o of _options || []) {
        let value: PropOptionValue;
        if (isString(o)) {
          value = o;
        } else if (o && typeof o === "object" && "value" in o && o.value != null) {
          value = o.value;
        } else {
          // Skip items that don't match expected format
          console.warn("Skipping invalid option:", o);
          continue;
        }
        if (allValues.has(value)) {
          continue
        }
        allValues.add(value)
        newOptions.push(o)
      }
      let data = baseData
      if (newOptions.length) {
        data = [
          ...baseData,
          ...newOptions,
        ] as RawPropOption[]
        setPageable({
          page: page + 1,
          prevContext: res.context,
          data,
          values: allValues,
        })
      } else {
        setCanLoadMore(false)
      }
      return data;
    },
    enabled: !!queryEnabled,
  });

  // Track queryKey and account changes
  const queryKeyString = JSON.stringify(queryKeyInput);
  const accountKey = JSON.stringify(accountValue);
  const prevQueryKeyRef = useRef<string>();
  const prevAccountKeyRef = useRef<string>();

  // Reset pagination when queryKey changes
  useEffect(() => {
    const queryKeyChanged = prevQueryKeyRef.current && prevQueryKeyRef.current !== queryKeyString;

    if (queryKeyChanged) {
      // Query params changed - reset pagination state
      // React Query will automatically refetch due to queryKey change
      setPage(0);
      setContext(undefined);
      setCanLoadMore(true);
      setPageable({
        page: 0,
        prevContext: {},
        data: [],
        values: new Set(),
      });
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
      // With staleTime: 0, the queryKey change will trigger a fresh fetch
      // But if the queryKey didn't change (e.g., A -> null -> A), we need manual refetch
      if (accountValue != null && queryEnabled) {
        refetch();
      }
    }

    prevAccountKeyRef.current = accountKey;
  }, [accountKey, onChange, queryEnabled, accountValue, refetch]);

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
      options={pageable.data.map(sanitizeOption)}
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
          if (disableQueryDisabling && !queryEnabled) {
            refetch(); // TODO don't refetch if same exact params? (this is just for stress demo -- for now)
          }
        },
      }}
    />
  );
}
