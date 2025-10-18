import type {
  ConfigurePropOpts, PropOptionValue,
} from "@pipedream/sdk";
import { useQuery } from "@tanstack/react-query";
import {
  useEffect, useState,
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
    idx, prop,
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

  const configuredPropsUpTo: Record<string, unknown> = {};
  for (let i = 0; i < idx; i++) {
    const prop = configurableProps[i];
    configuredPropsUpTo[prop.name] = configuredProps[prop.name];
  }
  const componentConfigureInput: ConfigurePropOpts = {
    externalUserId,
    page,
    prevContext: context,
    id: component.key,
    propName: prop.name,
    configuredProps: configuredPropsUpTo,
    dynamicPropsId: dynamicProps?.id,
  };
  if (prop.useQuery) {
    componentConfigureInput.query = query || ""; // TODO ref.value ? Is this still supported?
  }
  // exclude dynamicPropsId from the key since only affect it should have is to add / remove props but prop by name should not change!
  const queryKeyInput = {
    ...componentConfigureInput,
  }
  delete queryKeyInput.dynamicPropsId

  const [
    error,
    setError,
  ] = useState<{ name: string; message: string; }>();

  // Reset pagination and error when dependent fields change.
  // This ensures the next query starts fresh from page 0, triggering a data replace instead of append
  useEffect(() => {
    setPage(0);
    setCanLoadMore(true);
    setError(undefined);
  }, [
    externalUserId,
    component.key,
    prop.name,
    JSON.stringify(configuredPropsUpTo),
  ]);

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
    data,
    isFetching, refetch,
  } = useQuery({
    queryKey: [
      "componentConfigure",
      queryKeyInput,
    ],
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
        // Return proper pageable structure on error to prevent crashes
        return {
          page: 0,
          prevContext: {},
          data: [],
          values: new Set<PropOptionValue>(),
        };
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

      // For fresh queries (page 0), start with empty set to avoid accumulating old options
      // For pagination (page > 0), use existing set to dedupe across pages
      const allValues = page === 0
        ? new Set<PropOptionValue>()
        : new Set(pageable.values)
      const newOptions = []
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
      let responseData = pageable.data
      if (newOptions.length) {
        // Replace data on fresh queries (page 0), append on pagination (page > 0)
        responseData = page === 0
          ? newOptions as RawPropOption[]
          : [
            ...pageable.data,
            ...newOptions,
          ] as RawPropOption[]
        const newPageable = {
          page: page + 1,
          prevContext: res.context,
          data: responseData,
          values: allValues,
        }
        setPageable(newPageable)
        return newPageable;
      } else {
        setCanLoadMore(false)
        return pageable;
      }
    },
    enabled: !!queryEnabled,
  });

  // Sync pageable state with query data to handle both fresh fetches and cached returns
  // When React Query returns cached data, the queryFn doesn't run, so we need to sync
  // the state here to ensure options populate correctly on remount
  useEffect(() => {
    if (data) {
      setPageable(data);
    }
  }, [
    data,
  ]);

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
