import { ConfigurablePropBoolean } from "@pipedream/sdk"
import { useFormFieldContext } from "../hooks/form-field-context"
import { useCustomize } from "../hooks/customization-context"
import type { CSSProperties } from "react"

export function ControlBoolean() {
  const props = useFormFieldContext<ConfigurablePropBoolean>()
  const {id, value, onChange } = props
  const { getProps } = useCustomize()
  const baseStyles: CSSProperties = {
    width: "16px",
    height: "16px",
    gridArea: "control",
    margin: "0 0.5rem 0 0",
  }
  return <input id={id} type="checkbox" {...getProps("controlBoolean", baseStyles, props)} checked={value ?? false} onChange={(e) => onChange(e.target.checked)} />
}
