import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import {
  changeLanguageActionCreator,
  addLanguageActionCreator,
} from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { userSlice } from "../../redux/user/slice";
import { changeDrawerState } from "../../redux/shoppingCart/slice";

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // JWT解碼
  const jwt = useSelector((state) => state.user.token);
  const [username, setUsername] = useState("");

  // 取得購物車資訊
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const shoppingCartLoading = useSelector(
    (state) => state.shoppingCart.loading
  );

  // 側邊欄購物車開關
  const drawerState = useSelector((state) => state.shoppingCart.drawer);
  const showDrawer = () => {
    // console.log(drawerState);
    if (drawerState === true) {
      dispatch(changeDrawerState(false));
    } else {
      dispatch(changeDrawerState(true));
    }
  };

  const menuClickHandler = (e) => {
    // console.log(e);
    if (e.key === "new") {
      dispatch(addLanguageActionCreator("新語言", "new_lang"));
    } else {
      dispatch(changeLanguageActionCreator(e.key));
    }
  };

  const onLogout = () => {
    dispatch(userSlice.actions.logOut());
    navigate("/");
  };

  useEffect(() => {
    if (jwt) {
      // jwt解碼，並將解碼後的username顯示在header
      const token = jwt_decode<JwtPayload>(jwt);
      setUsername(token.username);
    }
  }, [jwt]);

  return (
    <div className={styles["app-header"]}>
      <div className={styles["top-header"]}>
        <div className={styles.inner}>
          <div>
            <Typography.Text> {t("header.slogan")}</Typography.Text>
            <Dropdown.Button
              style={{ marginLeft: 15 }}
              overlay={
                <Menu onClick={menuClickHandler}>
                  {languageList.map((item) => {
                    return <Menu.Item key={item.code}>{item.name}</Menu.Item>;
                  })}
                  <Menu.Item key={"new"}>
                    {t("header.add_new_language")}
                  </Menu.Item>
                </Menu>
              }
              icon={<GlobalOutlined />}
            >
              {language === "zh" ? "中文" : "English"}
            </Dropdown.Button>
          </div>
          {/* 以jwt判斷欲顯示的按鈕 */}
          {jwt ? (
            <Button.Group className={styles["button-group"]}>
              <Typography.Text>
                {t("header.welcome")} {username}
              </Typography.Text>
              {/* 第二版側邊購物車 */}
              <Button onClick={showDrawer} style={{ marginLeft: 5 }}>
                購物抽屜
              </Button>
              <Button onClick={() => navigate("/todolist")}>待辦事項</Button>
              {/* 第一版跳頁購物車 */}
              <Button
                loading={shoppingCartLoading}
                onClick={() => navigate("/shoppingCart")}
              >
                {t("header.shoppingCart")}( {shoppingCartItems.length} )
              </Button>
              <Button onClick={onLogout}>{t("header.signOut")}</Button>
            </Button.Group>
          ) : (
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => navigate("/register")}>
                {" "}
                {t("header.register")}
              </Button>
              <Button onClick={() => navigate("/signin")}>
                {" "}
                {t("header.signin")}
              </Button>
            </Button.Group>
          )}
        </div>
      </div>
      <Layout.Header className={styles["main-header"]}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="" className={styles["App-logo"]} />
          <Typography.Title level={3} className={styles.title}>
            {t("header.title")}
          </Typography.Title>
        </span>
        <Input.Search
          placeholder={"請輸入旅遊目的地、主題、或關鍵字"}
          className={styles["search-input"]}
          onSearch={(keyword) => navigate("/search/" + keyword)}
        ></Input.Search>
      </Layout.Header>
      <Menu
        className={styles["main-menu"]}
        mode={"horizontal"}
        items={[
          { key: 1, label: t("header.home_page") },
          { key: 2, label: t("header.weekend") },
          { key: 3, label: t("header.group") },
          { key: 4, label: t("header.backpack") },
          { key: 5, label: t("header.private") },
          { key: 6, label: t("header.cruise") },
          { key: 7, label: t("header.hotel") },
          { key: 8, label: t("header.local") },
          { key: 9, label: t("header.theme") },
          { key: 10, label: t("header.custom") },
          { key: 11, label: t("header.study") },
          { key: 12, label: t("header.visa") },
          { key: 13, label: t("header.enterprise") },
          { key: 14, label: t("header.high_end") },
          { key: 15, label: t("header.outdoor") },
          { key: 16, label: t("header.insurance") },
        ]}
      ></Menu>
    </div>
  );
};
