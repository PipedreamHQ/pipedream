import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ComponentConfigureOpts } from "@pipedream/sdk";
import { useFormContext } from "../hooks/form-context";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useFrontendClient } from "../hooks/frontend-client-context";
import { ControlSelect } from "./ControlSelect";

export type RemoteOptionsContainerProps = {
  queryEnabled?: boolean;
};

export function RemoteOptionsContainer({ queryEnabled }: RemoteOptionsContainerProps) {
  const client = useFrontendClient();
  const {
    userId,
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

  const configuredPropsUpTo: Record<string, unknown> = {};
  for (let i = 0; i < idx; i++) {
    const prop = configurableProps[i];
    configuredPropsUpTo[prop.name] = configuredProps[prop.name];
  }
  const componentConfigureInput: ComponentConfigureOpts = {
    userId,
    componentId: component.key,
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

  // TODO handle error!
  const {
    isFetching, data, refetch,
  } = useQuery({
    queryKey: [
      "componentConfigure",
      queryKeyInput,
    ],
    queryFn: async () => {
      setError(undefined);
      const res = await client.componentConfigure(componentConfigureInput);

      // console.log("res", res)
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
      if (options?.length) {
        return options;
      }
      if (stringOptions?.length) {
        const options = [];
        for (const stringOption of stringOptions) {
          options.push({
            label: stringOption,
            value: stringOption,
          });
        }
        return options;
      }
      return [];
    },
    enabled: !!queryEnabled,
  });

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
      options={data || []}
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
