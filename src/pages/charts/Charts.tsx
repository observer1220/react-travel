import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import {
  Button,
  FlexBox,
  Link,
  Menu,
  MenuItem,
  Tree,
  TreeItem,
} from "@ui5/webcomponents-react";
import styles from "./Charts.module.css";
import { useSelector, useAppDispatch } from "../../redux/hooks";

import { Container } from "../../components/styles/main";
// import { ColumnChart } from "@ui5/webcomponents-react-charts";

export const ChartsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);

  useEffect(() => {
    if (jwt) {
    }
  }, []);

  return (
    <MainLayout>
      <Container>
        <>
          <Button
            // ref={{
            //   current: "[Circular]",
            // }}
            onClick={() => {
              console.log("哈囉");
            }}
          >
            菜單
          </Button>
          <Menu
            // ref={
            //   {
            //     // current: {['Circular']},
            //   }
            // }
            onItemClick={() => {
              console.log("讚");
            }}
          >
            <MenuItem icon="add-document" text="New File" />
            <MenuItem disabled icon="add-folder" text="New Folder" />
            <MenuItem icon="open-folder" startsSection text="Open" />
            <MenuItem text="Close" />
            <MenuItem icon="action-settings" startsSection text="Preferences" />
            <MenuItem icon="journey-arrive" text="Exit" />
          </Menu>
        </>
      </Container>
    </MainLayout>
  );
};
