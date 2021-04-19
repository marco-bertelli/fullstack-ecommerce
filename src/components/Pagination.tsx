import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

interface Props<T> {
  page: number;
  totalPages: number;
  tabType?: string;
  activeTab?: T;
}

const Pagination = <T extends string>({
  page,
  totalPages,
  tabType,
  activeTab,
}: Props<T>) => {
  const { pathname } = useLocation();
  return (
    <div className="pagination">
      <Link
        to={
          tabType
            ? `${pathname}?${tabType}=${activeTab}&page=${
                page > 1 ? page - 1 : 1
              }`
            : `${pathname}?page=${page > 1 ? page - 1 : 1}`
        }
        className="pagination__page"
        style={{ cursor: page === 1 ? "not-allowed" : undefined }}
        onClick={page === 1 ? (e) => e.preventDefault() : undefined}
      >
        <p className="paragraph--center">Prec</p>
      </Link>

      <div className="page-total">
        <p className="paragraph--center">
          {page} of {totalPages}
        </p>
      </div>

      <Link
        to={
          tabType
            ? `${pathname}?${tabType}=${activeTab}&page=${
                page < totalPages ? page + 1 : page
              }`
            : `${pathname}?page=${page < totalPages ? page + 1 : page}`
        }
        className="pagination__page"
        style={{ cursor: page === totalPages ? "not-allowed" : undefined }}
        onClick={page === totalPages ? (e) => e.preventDefault() : undefined}
      >
        <p className="paragraph--center">Succ</p>
      </Link>
    </div>
  );
};

export default Pagination;
