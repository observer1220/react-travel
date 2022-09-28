import React from "react";
import {
  SideMenu,
  Carousel,
  ProductCollection,
  BusinessPartners,
} from "../../components";
import { Row, Col, Typography, Spin } from "antd";
import sideImage1 from "../../assets/images/sider_2019_12-09.png";
import sideImage2 from "../../assets/images/sider_2019_02-04.png";
import sideImage3 from "../../assets/images/sider_2019_02-04-2.png";
// withTranslation為高階組件，WithTranslation為類型定義
import { withTranslation, WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { giveMeDataActionCreator } from "../../redux/recommendProducts/recommendProductsActions";
import { MainLayout } from "../../layouts/mainLayout";

const mapStateToProps = (state: RootState) => {
  return {
    loading: state.recommendProducts.loading,
    error: state.recommendProducts.error,
    productList: state.recommendProducts.productList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    giveMeData: () => {
      dispatch(giveMeDataActionCreator());
    },
  };
};

type PropsType = WithTranslation &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

// class組件
class HomePageComponent extends React.Component<PropsType> {
  async componentDidMount() {
    this.props.giveMeData();
  }

  render(): React.ReactNode {
    // console.log(this.props);
    const { t, productList, loading, error } = this.props;

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
        <Row style={{ marginTop: 20 }}>
          <Col span={6}>
            <SideMenu />
          </Col>
          <Col span={18}>
            <Carousel />
          </Col>
        </Row>
        <ProductCollection
          title={
            <Typography.Title level={3} type="warning">
              {t("home_page.hot_recommended")}
            </Typography.Title>
          }
          sideImage={sideImage1}
          products={productList[0].touristRoutes}
        ></ProductCollection>
        <ProductCollection
          title={
            <Typography.Title level={3} type="danger">
              {t("home_page.new_arrival")}
            </Typography.Title>
          }
          sideImage={sideImage2}
          products={productList[1].touristRoutes}
        ></ProductCollection>
        <ProductCollection
          title={
            <Typography.Title level={3} type="success">
              {t("home_page.domestic_travel")}
            </Typography.Title>
          }
          sideImage={sideImage3}
          products={productList[2].touristRoutes}
        ></ProductCollection>
        <BusinessPartners />
      </MainLayout>
    );
  }
}

// 第1個括號是語言使用的命名空間，第2個括號是組件HomePage組件，代表高階組件的高階組件
export const HomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HomePageComponent));
