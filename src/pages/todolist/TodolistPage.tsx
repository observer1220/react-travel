import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Divider } from "antd";
import {
  Button,
  AnalyticalTable,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  Label,
  Title,
  FlexBox,
} from "@ui5/webcomponents-react";
import styles from "./TodolistPage.module.css";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { getTodolist } from "../../redux/todolist/slice";
import { Container } from "../../components/styles/main";
import { DialogComponent } from "../../components/diglog";
import { Pagination } from "../../components/Pagination";
import { DeleteMessageBox, ExportButon } from "../../components";

let PageSize = 5;

export const TodolistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);
  const dataSource = useSelector((state) => state.todolist.data);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogStatus, setDialogStatus] = useState(false);
  const [messageStatus, setMessageStatus] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    todos: "",
    remarks: "",
    category: "",
    EstEndDate: "",
    trustee: [],
    phone: "",
    enabled: true,
    username: "",
  });

  // 對話框的種類
  const [fieldName] = useState([
    {
      label: "優先順序",
      placeholder: "請選擇優先順序...",
      name: "category",
      type: "select",
      options: [
        { label: "", value: "" },
        { label: "高", value: "高" },
        { label: "中", value: "中" },
        { label: "低", value: "低" },
      ],
      required: true,
    },
    {
      label: "預計完成日",
      placeholder: "請選擇預計完成日...",
      name: "EstEndDate",
      type: "datepicker",
      required: false,
    },
    {
      label: "待辦事項",
      placeholder: "請輸入待辦事項...",
      name: "todos",
      type: "input",
      required: false,
      minLength: 2,
      maxLength: 10,
    },
    {
      label: "備註",
      placeholder: "請輸入備註...",
      name: "remarks",
      type: "input",
      required: false,
      pattern: /^[A-Za-z]+$/i,
      patternMsg: "只能輸入英文",
    },
    {
      label: "受託人",
      // placeholder: "",
      name: "trustee",
      type: "checkbox",
      options: [
        { label: "Jack", checked: false },
        { label: "Vincent", checked: false },
        { label: "Ruby", checked: false },
        { label: "Kent", checked: false },
      ],
      required: false,
      // pattern: /^[A-Za-z]+$/i,
      // patternMsg: "只能輸入英文",
    },
    {
      label: "電話號碼",
      name: "phone",
      placeholder: "請輸入電話號碼",
      type: "input",
      required: "true",
      pattern: /^09\d{2}(\d{6}|-\d{3}-\d{3})+$/i,
      patternMsg: "請輸入正確格式",
    },
    {
      label: "啟動與否",
      name: "enabled",
      type: "switch",
    },
  ]);

  // 設定分頁
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return dataSource.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, dataSource]);

  // 分頁元件: 只有dialogStatus變更才會重新渲染
  const DialogComponentMemo = useMemo(
    () => (
      <DialogComponent
        dialogTitle={title}
        option={option}
        isOpen={dialogStatus}
        onChangeStatus={setDialogStatus}
        formData={formData}
        fieldName={fieldName}
      ></DialogComponent>
    ),
    [dialogStatus]
  );

  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
    }
  }, []);

  const sourceLabel = [
    { Header: "ID", accessor: "id", width: 50 },
    {
      Header: "優先順序",
      accessor: "category",
      width: 100,
      disableFilters: false,
      disableGroupBy: true,
      disableSortBy: false,
    },
    { Header: "預計完成日", accessor: "EstEndDate", width: 150 },
    { Header: "待辦事項", accessor: "todos", width: 200 },
    { Header: "備註", accessor: "remarks", width: 100 },
    { Header: "建立人員", accessor: "username", width: 150 },
    {
      Header: "功能",
      accessor: ".",
      width: 100,
      disableFilters: true,
      disableGroupBy: true,
      disableResizing: true,
      disableSortBy: true,
      id: "actions",
      Cell: (instance) => {
        const { row } = instance;
        return (
          <FlexBox>
            <Button
              design="Positive"
              icon="edit"
              style={{ marginRight: "5px" }}
              onClick={() => {
                setTitle("編輯待辦事項");
                setDialogStatus(true);
                setOption("edit");
                setFormData(row.original);
              }}
            ></Button>
            <Button
              design="Negative"
              icon="delete"
              onClick={async () => {
                setMessageStatus(true);
                setFormData(row.original);
              }}
            ></Button>
          </FlexBox>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <Container>
        <Divider orientation="left">
          <Title level="H2" style={{ color: "white" }}>
            本週待辦事項
          </Title>
        </Divider>
        <Button
          design="Positive"
          icon="add"
          onClick={() => {
            setTitle("新增待辦事項");
            setDialogStatus(true);
            setOption("add");
            setFormData({
              id: null,
              todos: "",
              remarks: "",
              category: "",
              EstEndDate: "",
              trustee: [],
              phone: "",
              enabled: true,
              username: formData.username,
            });
          }}
        />
        {/* 匯出元件 */}
        <ExportButon dataSource={dataSource} sourceLabel={sourceLabel} />
        <br />
        <AnalyticalTable
          columns={sourceLabel}
          data={currentTableData}
          filterable
          rowHeight={40}
          selectionMode="MultiSelect"
        />
        {/* 一般表格 */}
        {/* <Table
          columns={sourceLabel.map((item, idx) => (
            <TableColumn minWidth={item.width} key={idx}>
              <Label>{item.Header}</Label>
            </TableColumn>
          ))}
        >
          {currentTableData.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>
                  <Label>{item.id}</Label>
                </TableCell>
                <TableCell>
                  <Label>{item.category}</Label>
                </TableCell>
                <TableCell>
                  <Label>{item.EstEndDate}</Label>
                </TableCell>
                <TableCell>
                  <Label>{item.todos}</Label>
                </TableCell>
                <TableCell>
                  <Label>{item.remarks}</Label>
                </TableCell>
                <TableCell>
                  <Label>{item.username}</Label>
                </TableCell>
                <TableCell>
                  <div>
                    <Button
                      design="Positive"
                      icon="edit"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        setTitle("編輯待辦事項");
                        setDialogStatus(true);
                        setOption("edit");
                        setFormData({
                          id: item.id,
                          todos: item.todos,
                          remarks: item.remarks,
                          category: item.category,
                          EstEndDate: item.EstEndDate,
                          trustee: item.trustee,
                          phone: item.phone,
                          enabled: item.enabled,
                          username: item.username,
                        });
                      }}
                    ></Button>
                    <Button
                      design="Negative"
                      icon="delete"
                      onClick={async () => {
                        setMessageStatus(true);
                        setFormData({
                          id: item.id,
                          todos: item.todos,
                          remarks: item.remarks,
                          category: item.category,
                          EstEndDate: item.EstEndDate,
                          trustee: item.trustee,
                          phone: item.phone,
                          enabled: item.enabled,
                          username: item.username,
                        });
                      }}
                    ></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table> */}
        {/* Dialog Component */}
        <>{DialogComponentMemo}</>
        {/* Pagination Component  */}
        <Pagination
          className={styles["pagination-bar"]}
          currentPage={currentPage}
          totalCount={dataSource.length}
          pageSize={PageSize}
          siblingCount={1}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
        {/* 提示視窗 */}
        <DeleteMessageBox
          isOpen={messageStatus}
          onChangeStatus={setMessageStatus}
          data={formData}
        />
      </Container>
    </MainLayout>
  );
};
