import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ProductTab } from "../types";

interface Props {
  label: ProductTab;
  tabType: string
}

const Tab: React.FC<Props> = ({ label, tabType }) => {
  const { pathname } = useLocation();

  return (
    <Link to={`${pathname}?${tabType}=${label}`}>
      <p className="paragraph btn-tab" style={{ marginRight: "1rem" }}>
        {label}
      </p>
    </Link>
  );
};

export default Tab;
