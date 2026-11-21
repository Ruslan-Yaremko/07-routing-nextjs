"use client";

import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={totalPages}
      onPageChange={({ selected }) => {
        onPageChange(selected + 1);
      }}
      forcePage={Math.min(
        Math.max(page - 1, 0),
        totalPages - 1
      )}
      previousLabel="Previous"
      nextLabel="Next"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      renderOnZeroPageCount={null}
    />
  );
}