import React, { useEffect } from "react";
import styles from "./Searchpage.module.css";
import { Header, Footer, FilterArea, ProductList } from "../../components";
import { useParams, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { searchProduct } from "../../redux/productSearch/slice";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { MainLayout } from "../../layouts/mainLayout";

type MatchParams = {
  keywords: string;
};

export const SearchPage: React.FC = () => {
  const { keywords } = useParams<MatchParams>();
  // console.log(keywords);

  const loading = useSelector((state) => state.productSearch.loading);
  const error = useSelector((state) => state.productSearch.error);
  const pagination = useSelector((state) => state.productSearch.pagination);
  const productList = useSelector((state) => state.productSearch.data);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // [location]代表關注URL的變化，因為keyword會體驗在URL中
  // 一旦URL發生變化，就會立即啟動useEffect()函數，重新進行旅遊路線的搜索
  useEffect(() => {
    if (keywords) {
      dispatch(searchProduct({ nextPage: 1, pageSize: 10, keywords }));
    }
  }, [location]);

  const onPageChange = (nextPage, pageSize) => {
    if (keywords) {
      dispatch(searchProduct({ nextPage, pageSize, keywords }));
    }
  };

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          marginTop: 200,
          marginBottom: 200,
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      ></Spin>
    );
  }

  if (error) {
    return <div>網站出錯:{error}</div>;
  }
  return (
    <MainLayout>
      {/* 分類過濾器 */}
      <div className={styles["product-list-container"]}>
        <FilterArea />
      </div>
      {/* 產品列表 */}
      <div className={styles["product-list-container"]}>
        <ProductList
          data={productList}
          paging={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
