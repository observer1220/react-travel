import React from "react";
// import styles from "./Footer.module.css";
import { Layout, Typography } from "antd";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Layout.Footer>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        {/* 版權所有 @ React 旅遊網 */}
        {t("footer.detail")}
      </Typography.Title>
    </Layout.Footer>
  );
};
