import React from "react";
import styles from "./ZodiacLayout.module.css";
import { Layout } from "antd";
const { Content } = Layout;
interface PropsTypes {
  children: React.ReactNode;
}
export const ZodiacLayout: React.FC<PropsTypes> = (props) => {
  return (
    <Layout className={styles["user-layout-container"]}>
      <Content className={styles["content"]}>
        <div className={styles["top"]}>{props.children}</div>
      </Content>
    </Layout>
  );
};
