import type { PropOptionValue } from "@pipedream/sdk";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
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
type ControlSelectProps<T extends PropOptionValue> = {
  isCreatable?: boolean;
  options: LabelValueOption<T>[];
  selectProps?: ReactSelectProps<LabelValueOption<T>, boolean>;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
  components?: ReactSelectProps<LabelValueOption<T>, boolean>["components"];
};

export function ControlSelect<T extends PropOptionValue>({
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

    if (Array.isArray(rawValue)) {
      // if simple, make lv (XXX combine this with other place this happens)
      if (!isOptionWithLabel(rawValue[0])) {
        return rawValue.map((o) =>
          selectOptions.find((item) => item.value === o) || sanitizeOption(o as T));
      }
    } else if (rawValue && typeof rawValue === "object" && "__lv" in (rawValue as Record<string, unknown>)) {
      // Extract the actual option from __lv wrapper and sanitize to LV
      return sanitizeOption(((rawValue as Record<string, unknown>).__lv) as T);
    } else if (!isOptionWithLabel(rawValue)) {
      const lvOptions = selectOptions?.[0] && isOptionWithLabel(selectOptions[0]);
      if (lvOptions) {
        for (const item of selectOptions) {
          if (item.value === rawValue) {
            return item;
          }
        }
      } else {
        return sanitizeOption(rawValue as T);
      }
    }

    return null;
  }, [
    rawValue,
    selectOptions,
  ]);

  const props = select.getProps("controlSelect", baseSelectProps)

  // Use ref to store latest onLoadMore callback
  // This allows stable component reference while calling current callback
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [
    onLoadMore,
  ]);

  // Use ref to store latest showLoadMoreButton value
  const showLoadMoreButtonRef = useRef(showLoadMoreButton);
  useEffect(() => {
    showLoadMoreButtonRef.current = showLoadMoreButton;
  }, [
    showLoadMoreButton,
  ]);

  // Memoize custom components to prevent remounting
  // Component reference is stable, but reads current values from refs
  const finalComponents = useMemo(() => {
    const base = {
      ...props.components,
      ...componentsOverride,
    };

    // Always set MenuList, conditionally render button inside
    const CustomMenuList = ({
      // eslint-disable-next-line react/prop-types
      children, ...menuProps
    }: MenuListProps<LabelValueOption<T>, boolean>) => (
      <components.MenuList  {...menuProps}>
        {children}
        {showLoadMoreButtonRef.current && (
          <div className="pt-4">
            <LoadMoreButton onChange={() => onLoadMoreRef.current?.()} />
          </div>
        )}
      </components.MenuList>
    );
    CustomMenuList.displayName = "CustomMenuList";
    base.MenuList = CustomMenuList;

    return base;
  }, []); // Empty deps - stable reference, reads current values from refs

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
      components={finalComponents}
      {...additionalProps}
    />
  );
}
