import type {
  ConfigurePropOpts, PropOptionValue,
} from "@pipedream/sdk";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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

      const newOptions = []
      const allValues = new Set(pageable.values)
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
      let data = pageable.data
      if (newOptions.length) {
        data = [
          ...pageable.data,
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
