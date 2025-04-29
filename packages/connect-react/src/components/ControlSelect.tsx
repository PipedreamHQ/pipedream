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
    setSelectOptions(options)
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
        if (typeof ret[0] !== "object") {
          const lvs = [];
          for (const o of ret) {
            let obj = {
              label: o,
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
      } else if (typeof ret !== "object") {
        const lvOptions = selectOptions?.[0] && typeof selectOptions[0] === "object";
        if (lvOptions) {
          for (const item of selectOptions) {
            if (item.value === rawValue) {
              ret = item;
              break;
            }
          }
        } else {
          ret = {
            label: rawValue,
            value: rawValue,
          }
        }
      } else if (ret.__lv) {
        ret = ret.__lv
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
          <LoadMoreButton onChange={onLoadMore}/>
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
    const createOption = (input: unknown) => {
      if (typeof input === "object") return input
      return {
        label: input,
        value: input,
      }
    }
    const newOption = createOption(inputValue)
    let newRawValue = newOption
    const newSelectOptions = selectOptions
      ? [
        newOption,
        ...selectOptions,
      ]
      : [
        newOption,
      ]
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
        if (typeof o[0] === "object" && "value" in o[0]) {
          onChange({
            __lv: o,
          });
        } else {
          onChange(o);
        }
      } else if (typeof o === "object" && "value" in o) {
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
  return (
    <MaybeCreatableSelect
      inputId={id}
      instanceId={id}
      options={selectOptions}
      value={selectValue}
      isMulti={prop.type.endsWith("[]")}
      isClearable={true}
      required={!prop.optional}
      {...props}
      {...selectProps}
      {...additionalProps}
      onChange={handleChange}
    />
  );
}
