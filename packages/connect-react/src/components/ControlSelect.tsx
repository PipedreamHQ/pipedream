import {
  useEffect,
  useMemo, useState,
} from "react";
import Select, {
  Props as ReactSelectProps, components,
} from "react-select";
import type { CSSObjectWithLabel } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { BaseReactSelectProps } from "../hooks/customization-context";
import { LoadMoreButton } from "./LoadMoreButton";
import {
  isString, isOptionWithValue, OptionWithValue,
} from "../utils/type-guards";

// XXX T and ConfigurableProp should be related
type ControlSelectProps<T> = {
  isCreatable?: boolean;
  options: {label: string; value: T;}[];
  selectProps?: ReactSelectProps;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
};

export function ControlSelect<T>({
  isCreatable, options, selectProps, showLoadMoreButton, onLoadMore,
}: ControlSelectProps<T>) {
  const formFieldCtx = useFormFieldContext();
  const {
    id, prop, value, onChange,
  } = formFieldCtx;
  const {
    select, theme,
  } = useCustomize();
  const [
    selectOptions,
    setSelectOptions,
  ] = useState(options);
  const [
    rawValue,
    setRawValue,
  ] = useState(value);

  useEffect(() => {
    // Ensure all options have proper primitive values for label/value
    const sanitizedOptions = options.map((option) => {
      if (typeof option === "string") return option;

      // If option has __lv wrapper, extract the inner option
      if (option && typeof option === "object" && "__lv" in option) {
        const innerOption = option.__lv;
        return {
          label: String(innerOption?.label || innerOption?.value || ""),
          value: innerOption?.value,
        };
      }

      // Handle nested label and value objects
      let actualLabel = "";
      let actualValue = option.value;

      // Extract nested label
      if (option.label && typeof option.label === "object" && "label" in option.label) {
        actualLabel = String(option.label.label || "");
      } else {
        actualLabel = String(option.label || option.value || "");
      }

      // Extract nested value
      if (option.value && typeof option.value === "object" && "value" in option.value) {
        actualValue = option.value.value;
      }

      return {
        label: actualLabel,
        value: actualValue,
      };
    });
    setSelectOptions(sanitizedOptions)
  }, [
    options,
  ])

  useEffect(() => {
    setRawValue(value)
  }, [
    value,
  ])

  const baseSelectProps: BaseReactSelectProps<never, never, never> = {
    styles: {
      container: (base): CSSObjectWithLabel => ({
        ...base,
        gridArea: "control",
        boxShadow: theme.boxShadow.input,
      }),
    },
  };

  const selectValue = useMemo(() => {
    let ret = rawValue;
    if (ret != null) {
      if (Array.isArray(ret)) {
        // if simple, make lv (XXX combine this with other place this happens)
        if (!isOptionWithValue(ret[0])) {
          const lvs = [];
          for (const o of ret) {
            let obj = {
              label: String(o),
              value: o,
            }
            for (const item of selectOptions) {
              if (item.value === o) {
                obj = item;
                break;
              }
            }
            lvs.push(obj);
          }
          ret = lvs;
        }
      } else if (ret && typeof ret === "object" && "__lv" in ret) {
        // Extract the actual option from __lv wrapper
        ret = ret.__lv;
      } else if (!isOptionWithValue(ret)) {
        const lvOptions = selectOptions?.[0] && isOptionWithValue(selectOptions[0]);
        if (lvOptions) {
          for (const item of selectOptions) {
            if (item.value === rawValue) {
              ret = item;
              break;
            }
          }
        } else {
          ret = {
            label: String(rawValue),
            value: rawValue,
          }
        }
      }
    }
    return ret;
  }, [
    rawValue,
    selectOptions,
  ]);

  const LoadMore = ({
    // eslint-disable-next-line react/prop-types
    children, ...props
  }) => {
    return (
      <components.MenuList  {...props}>
        { children }
        <div className="pt-4">
          <LoadMoreButton onChange={onLoadMore || (() => {})}/>
        </div>
      </components.MenuList>
    )
  }

  const props = select.getProps("controlSelect", baseSelectProps)

  if (showLoadMoreButton) {
    props.components = {
      // eslint-disable-next-line react/prop-types
      ...props.components,
      MenuList: LoadMore,
    }
  }

  const handleCreate = (inputValue: string) => {
    const createOption = (input: unknown): OptionWithValue => {
      if (isOptionWithValue(input)) return input
      const strValue = String(input);
      return {
        label: strValue,
        value: strValue,
      }
    }
    const newOption = createOption(inputValue)
    let newRawValue = newOption

    // NEVER add wrapped objects to selectOptions - only clean {label, value} objects
    const cleanSelectOptions = selectOptions.map((opt) => {
      if (typeof opt === "string") return opt;
      if (opt && typeof opt === "object" && "__lv" in opt) {
        return {
          label: String(opt.__lv?.label || ""),
          value: opt.__lv?.value,
        };
      }
      return opt;
    });

    const newSelectOptions = [
      newOption,
      ...cleanSelectOptions,
    ];
    setSelectOptions(newSelectOptions);

    if (prop.type.endsWith("[]")) {
      if (Array.isArray(rawValue)) {
        newRawValue = [
          ...rawValue.map(createOption),
          newOption,
        ]
      } else {
        newRawValue = [
          newOption,
        ]
      }
    }
    setRawValue(newRawValue)
    handleChange(newRawValue)
  };

  const handleChange = (o: unknown) => {
    if (o) {
      if (Array.isArray(o)) {
        if (typeof o[0] === "object" && o[0] && "value" in o[0]) {
          onChange({
            __lv: o,
          });
        } else {
          onChange(o);
        }
      } else if (typeof o === "object" && o && "value" in o) {
        onChange({
          __lv: o,
        });
      } else {
        throw new Error("unhandled option type"); // TODO
      }
    } else {
      onChange(undefined);
    }
  }

  const additionalProps = {
    onCreateOption: prop.remoteOptions
      ? handleCreate
      : undefined,
  }

  const MaybeCreatableSelect = isCreatable
    ? CreatableSelect
    : Select;

  // Final safety check - ensure NO __lv wrapped objects reach react-select
  const cleanedOptions = selectOptions.map((opt) => {
    if (typeof opt === "string") return opt;
    if (opt && typeof opt === "object" && "__lv" in opt && opt.__lv) {
      let actualLabel = "";
      let actualValue = opt.__lv.value;

      // Handle nested label in __lv
      if (opt.__lv.label && typeof opt.__lv.label === "object" && "label" in opt.__lv.label) {
        actualLabel = String(opt.__lv.label.label || "");
      } else {
        actualLabel = String(opt.__lv.label || opt.__lv.value || "");
      }

      // Handle nested value in __lv
      if (opt.__lv.value && typeof opt.__lv.value === "object" && "value" in opt.__lv.value) {
        actualValue = opt.__lv.value.value;
      }

      return {
        label: actualLabel,
        value: actualValue,
      };
    }
    return opt;
  });

  return (
    <MaybeCreatableSelect
      inputId={id}
      instanceId={id}
      options={cleanedOptions}
      value={selectValue}
      isMulti={prop.type.endsWith("[]")}
      isClearable={true}
      required={!prop.optional}
      getOptionLabel={(option) => {
        return typeof option === "string"
          ? option
          : String(option?.label || option?.value || "");
      }}
      getOptionValue={(option) => {
        return typeof option === "string"
          ? option
          : String(option?.value || "");
      }}
      onChange={handleChange}
      {...props}
      {...selectProps}
      {...additionalProps}
    />
  );
}
