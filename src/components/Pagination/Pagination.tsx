import { Icon } from "@ui5/webcomponents-react";
import { useAppDispatch } from "../../redux/hooks";
import { getTodolist } from "../../redux/todolist/slice";
import { usePagination, DOTS } from "../../redux/usePagination";
import styles from "./Pagination.module.scss";

interface PropsType {
  onPageChange: any;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  setPageSize: any;
  className: any;
}

export const Pagination: React.FC<PropsType> = ({
  onPageChange,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
  setPageSize,
  className,
}) => {
  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  const dispatch = useAppDispatch();

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "5px",
      }}
    >
      {/* <select
        style={{ height: "34px" }}
        onChange={(event) => {
          setPageSize(event.target.value);
          dispatch(getTodolist());
        }}
      >
        <option value={2}>2筆</option>
        <option value={5}>5筆</option>
        <option value={10}>10筆</option>
        <option value={50}>50筆</option>
      </select> */}
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
    </div>
  );
};
