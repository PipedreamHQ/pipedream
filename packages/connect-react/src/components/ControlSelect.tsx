import { useMemo } from "react";
import Select, { Props as ReactSelectProps } from "react-select";
import type { CSSObjectWithLabel } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { BaseReactSelectProps } from "../hooks/customization-context";

// XXX T and ConfigurableProp should be related
type ControlSelectProps<T> = {
  isCreatable?: boolean;
  options: {label: string; value: T;}[];
  selectProps?: ReactSelectProps;
};

export function ControlSelect<T>({
  isCreatable, options, selectProps,
}: ControlSelectProps<T>) {
  const formFieldCtx = useFormFieldContext();
  const {
    id, prop, value, onChange,
  } = formFieldCtx;
  const {
    select, theme,
  } = useCustomize();

  const baseSelectProps: BaseReactSelectProps<any, any, any> = {
    styles: {
      container: (base): CSSObjectWithLabel => ({
        ...base,
        gridArea: "control",
        boxShadow: theme.boxShadow.input,
      }),
    },
  };

  const selectValue = useMemo(() => {
    let ret = value;
    if (ret != null) {
      if (Array.isArray(ret)) {
        // if simple, make lv (XXX combine this with other place this happens)
        if (typeof ret[0] !== "object") {
          const lvs = [];
          for (const o of ret) {
            lvs.push({
              label: o,
              value: o,
            });
          }
          ret = lvs;
        }
      } else if (typeof ret !== "object") {
        const lvOptions = options?.[0] && typeof options[0] === "object";
        if (lvOptions) {
          for (const item of options) {
            if (item.value === value) {
              ret = item;
              break;
            }
          }
        }
      }
    }
    return ret;
  }, [
    value,
    options,
  ]);

  const MaybeCreatableSelect = isCreatable
    ? CreatableSelect
    : Select;
  return (
    <MaybeCreatableSelect
      inputId={id}
      instanceId={id}
      options={options}
      value={selectValue}
      isMulti={prop.type.endsWith("[]")}
      isClearable={true}
      required={!prop.optional}
      {...select.getProps("controlSelect", baseSelectProps)}
      {...selectProps}
      onChange={(o) => {
        if (o) {
          if (Array.isArray(o)) {
            if (typeof o[0] === "object" && "value" in o[0]) {
              const vs = [];
              for (const _o of o) {
                vs.push(_o.value);
              }
              onChange(vs);
            } else {
              onChange(o);
            }
          } else if (typeof o === "object" && "value" in o) {
            onChange(o.value);
          } else {
            throw new Error("unhandled option type"); // TODO
          }
        } else {
          onChange(undefined);
        }
      }}
    />
  );
}
