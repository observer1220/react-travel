import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Col, Divider, Typography, Anchor, Menu } from "antd";
import styles from "./DetailPage.module.css";
import {
  ProductIntro,
  ProductComments,
} from "../../components";
import { DatePicker, Button } from "antd";
import { commentMockData } from "./mockup";
import {
  getProductDetail,
} from "../../redux/productDetail/slice";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { MainLayout } from "../../layouts/mainLayout";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { addShoppingCartItem } from "../../redux/shoppingCart/slice";

const { RangePicker } = DatePicker;

type MatchParams = {
  touristRouteId: string;
};

export const DetailPage: React.FC = () => {
  const { touristRouteId } = useParams<MatchParams>();
  // console.log(touristRouteId);
  // 使用useSelector連接產品詳情的數據(redux-toolkit的作法)，組件狀態從自己身上，轉移到redux當中了
  const loading = useSelector(state => state.productDetail.loading);
  const error = useSelector(state => state.productDetail.error);
  const product = useSelector(state => state.productDetail.data);
  // useSelector(state => console.log(state))

  const dispatch = useAppDispatch();  

  const jwt = useSelector(state => state.user.token) as string
  const shoppingCartLoading = useSelector(state => state.shoppingCart.loading)

  useEffect(() => {
    if (touristRouteId) {
      dispatch(getProductDetail(touristRouteId))
    }
  }, []);

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
      <div className="styles['product-intro-container ">
        <Row>
          <Col span={13}>
            <ProductIntro
              title={product.title}
              shortDescription={product.description}
              price={product.price}
              coupons={product.coupons}
              points={product.points}
              discount={product.points}
              rating={product.rating}
              pictures={product.touristRoutePictures.map(
                (picture) => picture.url
              )}
            ></ProductIntro>
          </Col>
          <Col span={11}>
            <Button 
              style={{marginTop:50, marginBottom:30, display:'block'}}
              type="primary"
              danger
              loading={shoppingCartLoading}
              onClick={()=>{
                dispatch(addShoppingCartItem({jwt, touristRouteId: product.id}))
              }}
            >
              <ShoppingCartOutlined />
              放入購物車
            </Button>
            <RangePicker open style={{ marginTop: 20 }} />
          </Col>
        </Row>
      </div>
      {/* 帶有錨點功能的菜單 */}
      <Anchor className={styles["product-detail-anchor"]}>
        <Menu mode="horizontal">
          <Menu.Item key="1">
            <Anchor.Link href="#feature" title="產品特色"></Anchor.Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Anchor.Link href="#fees" title="費用"></Anchor.Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Anchor.Link href="#notes" title="預訂需知"></Anchor.Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Anchor.Link href="#comments" title="用戶評價"></Anchor.Link>
          </Menu.Item>
        </Menu>
      </Anchor>
      {/* 產品特色 */}
      <div id="feature" className={styles["product-detail-container"]}>
        <Divider orientation={"center"}>
          <Typography.Title level={3}>產品特色</Typography.Title>
        </Divider>
        <div
          dangerouslySetInnerHTML={{ __html: product.features }}
          style={{ margin: 50 }}
        ></div>
      </div>
      {/* 產品費用 */}
      <div id="fees" className={styles["product-detail-container"]}>
        <Divider orientation={"center"}>
          <Typography.Title level={3}>費用</Typography.Title>
        </Divider>
        <div
          dangerouslySetInnerHTML={{ __html: product.fees }}
          style={{ margin: 50 }}
        ></div>
      </div>
      {/* 預訂須知 */}
      <div id="notes" className={styles["product-detail-container"]}>
        <Divider orientation={"center"}>
          <Typography.Title level={3}>預訂須知</Typography.Title>
        </Divider>
        <div
          dangerouslySetInnerHTML={{ __html: product.notes }}
          style={{ margin: 50 }}
        ></div>
      </div>
      {/* 商品評價 */}
      <div id="comments" className={styles["product-detail-container"]}>
        <Divider orientation={"center"}>
          <Typography.Title level={3}>商品評價</Typography.Title>
        </Divider>
        <div style={{ margin: 40 }}>
          <ProductComments data={commentMockData}></ProductComments>
        </div>
      </div>
    </MainLayout>
  );
};
