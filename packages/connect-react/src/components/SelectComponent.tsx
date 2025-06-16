import { useId, useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import { useComponentsWithPagination } from "../hooks/use-components";
import {
  AppResponse, V1Component,
} from "@pipedream/sdk";

type SelectComponentProps = {
  app?: Partial<AppResponse> & { name_slug: string; };
  componentType?: "action" | "trigger";
  value?: Partial<V1Component> & { key: string; };
  onChange?: (component?: V1Component) => void;
};

export function SelectComponent({
  app,
  componentType,
  value,
  onChange,
}: SelectComponentProps) {
  const instanceId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    let cancelled = false;
    
    const timer = setTimeout(() => {
      if (!cancelled) {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 300);
    
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const {
    isLoading,
    components: allComponents,
    hasMore,
    loadMore,
    reset,
    isLoadingMore,
  } = useComponentsWithPagination({
    app: app?.name_slug,
    componentType,
  });

  // Filter components based on search query (client-side)
  const componentList = useMemo(() => {
    if (!debouncedSearchQuery) {
      return allComponents;
    }
    const query = debouncedSearchQuery.toLowerCase();
    return allComponents.filter(component => 
      component.name?.toLowerCase().includes(query) ||
      component.key?.toLowerCase().includes(query)
    );
  }, [allComponents, debouncedSearchQuery]);

  const selectedValue = useMemo(() => {
    // If we have a value but it's not in the current components list,
    // preserve it for display purposes
    const foundComponent = componentList?.find((c) => c.key === value?.key);
    if (foundComponent) {
      return foundComponent;
    } else if (value?.key) {
      // Return the partial value to maintain selection display
      return value as V1Component;
    }
    return null;
  }, [componentList, value]);

  // Custom MenuList component for infinite scroll - memoized to prevent recreation
  const MenuList = useMemo(() => {
    return (props: any) => (
      <components.MenuList {...props}>
        {props.children}
        {hasMore && !isLoading && (
          <div 
            style={{ padding: '8px', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              if (!isLoadingMore) {
                loadMore();
              }
            }}
          >
            {isLoadingMore ? 'Loading more...' : 'Load more'}
          </div>
        )}
      </components.MenuList>
    );
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      options={componentList}
      getOptionLabel={(o) => o.name || o.key}
      getOptionValue={(o) => o.key}
      value={selectedValue}
      onChange={(o) => onChange?.(o ? (o as V1Component) : undefined)}
      isLoading={isLoading}
      onInputChange={(inputValue, { action }) => {
        if (action === "input-change") {
          setSearchQuery(inputValue);
        }
      }}
      noOptionsMessage={({ inputValue }) => 
        isLoading ? "Loading..." : 
        inputValue ? `No components found for "${inputValue}"` : 
        "No components available"
      }
      components={{
        IndicatorSeparator: () => null,
        MenuList,
      }}
    />
  );
}
