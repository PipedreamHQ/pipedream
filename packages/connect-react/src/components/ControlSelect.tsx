import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CSSObjectWithLabel, MenuListProps,
} from "react-select";
import Select, {
  components,
  Props as ReactSelectProps,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import type { BaseReactSelectProps } from "../hooks/customization-context";
import { useCustomize } from "../hooks/customization-context";
import { useFormFieldContext } from "../hooks/form-field-context";
import { LabelValueOption } from "../types";
import {
  isOptionWithLabel,
  sanitizeOption,
} from "../utils/type-guards";
import { LoadMoreButton } from "./LoadMoreButton";

// XXX T and ConfigurableProp should be related
type ControlSelectProps<T> = {
  isCreatable?: boolean;
  options: LabelValueOption<T>[];
  selectProps?: ReactSelectProps<LabelValueOption<T>, boolean>;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
  components?: ReactSelectProps<LabelValueOption<T>, boolean>["components"];
};

export function ControlSelect<T>({
  isCreatable,
  options,
  selectProps,
  showLoadMoreButton,
  onLoadMore,
  components: componentsOverride,
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
    const sanitizedOptions = options.map(sanitizeOption);
    setSelectOptions(sanitizedOptions);
  }, [
    options,
  ]);

  useEffect(() => {
    setRawValue(value)
  }, [
    value,
  ])

  const baseSelectProps: BaseReactSelectProps<LabelValueOption<T>, boolean> = {
    styles: {
      container: (base): CSSObjectWithLabel => ({
        ...base,
        gridArea: "control",
        boxShadow: theme.boxShadow.input,
      }),
    },
  };

  const selectValue: LabelValueOption<T> | LabelValueOption<T>[] | null = useMemo(() => {
    if (rawValue == null) {
      return null;
    }

    let ret = rawValue;
    if (Array.isArray(ret)) {
      // if simple, make lv (XXX combine this with other place this happens)
      if (!isOptionWithLabel(ret[0])) {
        return ret.map((o) =>
          selectOptions.find((item) => item.value === o) || {
            label: String(o),
            value: o,
          });
      }
    } else if (ret && typeof ret === "object" && "__lv" in ret) {
      // Extract the actual option from __lv wrapper
      ret = ret.__lv;
    } else if (!isOptionWithLabel(ret)) {
      const lvOptions = selectOptions?.[0] && isOptionWithLabel(selectOptions[0]);
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

    return ret;
  }, [
    rawValue,
    selectOptions,
  ]);

  const LoadMore = ({
    // eslint-disable-next-line react/prop-types
    children, ...props
  }: MenuListProps<LabelValueOption<T>, boolean>) => {
    return (
      <components.MenuList  {...props}>
        {children}
        <div className="pt-4">
          <LoadMoreButton onChange={onLoadMore || (() => { })} />
        </div>
      </components.MenuList>
    )
  }

  const props = select.getProps("controlSelect", baseSelectProps)

  const finalComponents = {
    ...props.components,
    ...componentsOverride,
  };

  if (showLoadMoreButton) {
    finalComponents.MenuList = LoadMore;
  }

  const handleCreate = (inputValue: string) => {
    const newOption = sanitizeOption(inputValue as T)
    let newRawValue: LabelValueOption<T> | LabelValueOption<T>[] = newOption

    // NEVER add wrapped objects to selectOptions - only clean {label, value} objects
    const cleanSelectOptions = selectOptions.map(sanitizeOption);

    const newSelectOptions = [
      newOption,
      ...cleanSelectOptions,
    ];
    setSelectOptions(newSelectOptions as LabelValueOption<T>[]);

    if (prop.type.endsWith("[]")) {
      if (Array.isArray(rawValue)) {
        newRawValue = [
          ...rawValue.map(sanitizeOption),
          newOption,
        ] as LabelValueOption<T>[]
      } else {
        newRawValue = [
          newOption,
        ] as LabelValueOption<T>[]
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
  const cleanedOptions = selectOptions.map(sanitizeOption);

  return (
    <MaybeCreatableSelect
      inputId={id}
      instanceId={id}
      options={cleanedOptions}
      value={selectValue}
      isMulti={prop.type.endsWith("[]")}
      isClearable={true}
      required={!prop.optional}
      getOptionLabel={(option) => sanitizeOption(option).label}
      getOptionValue={(option) => String(sanitizeOption(option).value)}
      onChange={handleChange}
      {...props}
      {...selectProps}
      {...additionalProps}
    />
  );
}
