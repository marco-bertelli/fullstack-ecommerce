import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { calculateTotalPages } from "../helpers";

export const usePagination = <T, U>(
  totalItems: number,
  perPage: number,
  activeTab?: T,
  searchedItems?: U[] | null
) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const currentPage = params.get("page");

  const history= useHistory()

  useEffect(() => {
    if (currentPage) setPage(+currentPage);
    else setPage(1);
  }, [currentPage]);

  // quando cambia la tab resettare la pagina a 1
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (searchedItems) {
      setPage(1)
      setTotalPages(calculateTotalPages(searchedItems.length, perPage));
      // tolgo cat query se cerco
      history.replace(`${pathname}?page=1`)
      
    } else setTotalPages(calculateTotalPages(totalItems, perPage));
  }, [activeTab, searchedItems, totalItems, perPage, pathname, history]);

  return { page, totalPages };
};
