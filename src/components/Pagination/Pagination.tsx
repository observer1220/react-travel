import { Icon } from "@ui5/webcomponents-react";
import { usePagination, DOTS } from "../../redux/usePagination";
import styles from "./Pagination.module.scss";

interface PropsType {
  onPageChange: any;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className: any;
}

export const Pagination: React.FC<PropsType> = ({
  onPageChange,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
  className,
}) => {
  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={styles["pagination-container"]}>
      <li
        className={styles["pagination-item"]}
        onClick={onPrevious}
        style={{ display: currentPage === 1 ? "none" : "" }}
      >
        <Icon name="slim-arrow-left" style={{ color: "white" }} />
      </li>
      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === DOTS) {
          return <li className={styles["pagination-item dots"]}>...</li>;
        }
        return (
          <li
            key={idx}
            className={styles["pagination-item"]}
            onClick={() => onPageChange(pageNumber)}
            style={{
              background:
                pageNumber === currentPage ? "rgba(0, 0, 0, 0.08)" : "",
            }}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={styles["pagination-item"]}
        onClick={onNext}
        style={{ display: currentPage === lastPage ? "none" : "" }}
      >
        <Icon name="slim-arrow-right" style={{ color: "white" }} />
      </li>
    </ul>
  );
};
