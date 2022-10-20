import {
  Link,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
} from "@ui5/webcomponents-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SideNavigaton.module.css";

export const SideNavigationComponent: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SideNavigation
      fixedItems={
        <>
          <SideNavigationItem icon="chain-link" text="Useful Links" />
          <SideNavigationItem icon="history" text="History" />
        </>
      }
      onSelectionChange={function noRefCheck() {}}
    >
      <SideNavigationItem icon="home" text="首頁" />
      <SideNavigationItem expanded icon="group" text="組織管理">
        <SideNavigationSubItem text="人員管理" onClick={() => navigate("/")} />
        <SideNavigationSubItem text="權限管理" />
      </SideNavigationItem>
      <SideNavigationItem icon="locate-me" selected text="Locations" />
      <SideNavigationItem icon="calendar" text="Events">
        <SideNavigationSubItem text="Local" />
        <SideNavigationSubItem text="Others" />
      </SideNavigationItem>
    </SideNavigation>
  );
};
