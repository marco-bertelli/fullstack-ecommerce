import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ProductTab } from "../types";

interface Props<T> {
  label: T
  tabType: string;
  activeTab: ProductTab;
}

const Tab = <T extends string>({ label, tabType, activeTab }: Props<T>) => {
  const { pathname } = useLocation();

  return (
    <Link to={`${pathname}?${tabType}=${label}`}>
      <p
        className={`paragraph ${
          label === activeTab ? "btn-tab btn-tab--active" : "btn-tab"
        }`}
        style={{ marginRight: "1rem" }}
      >
        {label}
      </p>
    </Link>
  );
};

export default Tab;
