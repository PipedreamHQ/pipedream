import { useMemo } from "react";
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
    let ret = value;
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
            for (const item of options) {
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
        const lvOptions = options?.[0] && typeof options[0] === "object";
        if (lvOptions) {
          for (const item of options) {
            if (item.value === value) {
              ret = item;
              break;
            }
          }
        }
      } else if (ret.__lv) {
        ret = ret.__lv
      }
    }
    return ret;
  }, [
    value,
    options,
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
    options.unshift({
      label: inputValue,
      value: inputValue,
    })
  };

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
      {...props}
      {...selectProps}
      onCreateOption={handleCreate}
      onChange={(o) => {
        if (o) {
          if (Array.isArray(o)) {
            if (typeof o[0] === "object" && "value" in o[0]) {
              const vs = [];
              for (const _o of o) {
                if (prop.withLabel) {
                  vs.push(_o);
                } else {
                  vs.push(_o.value);
                }
              }
              onChange(vs);
            } else {
              onChange(o);
            }
          } else if (typeof o === "object" && "value" in o) {
            if (prop.withLabel) {
              onChange({
                __lv: o,
              });
            } else {
              onChange(o.value);
            }
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
