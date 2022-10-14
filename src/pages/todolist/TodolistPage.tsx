import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Divider } from "antd";
import {
  Button,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  Label,
  Title,
} from "@ui5/webcomponents-react";
import styles from "./TodolistPage.module.css";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { getTodolist, delTodolist } from "../../redux/todolist/slice";
import { Container } from "../../components/styles/main";
import { DialogComponent } from "../../components/diglog";
import { Pagination } from "../../components/Pagination";
import { ExportButon } from "../../components";

let PageSize = 5;

export const TodolistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);
  const dataSource = useSelector((state) => state.todolist.data);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogStatus, setDialogStatus] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    todos: "",
    remarks: "",
    category: "",
    EstEndDate: "",
    username: "",
  });

  // 對話框的種類
  const [fieldName] = useState([
    {
      label: "優先順序",
      placeholder: "請選擇優先順序...",
      name: "category",
      type: "select",
      required: true,
    },
    {
      label: "預計完成日",
      placeholder: "請選擇預計完成日...",
      name: "EstEndDate",
      type: "datepicker",
      required: true,
    },
    {
      label: "待辦事項",
      placeholder: "請輸入待辦事項...",
      name: "todos",
      type: "input",
      required: true,
      minLength: 2,
      maxLength: 10,
    },
    {
      label: "備註",
      placeholder: "請輸入備註...",
      name: "remarks",
      type: "input",
      required: true,
      pattern: /^[A-Za-z]+$/i,
      patternMsg: "只能輸入英文",
    },
  ]);

  // 設定分頁
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return dataSource.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, dataSource]);

  // 生命週期初始化階段
  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
    }
  }, []);

  const sourceLabel = [
    { name: "ID" },
    { name: "待辦事項" },
    { name: "備註" },
    { name: "建立人員" },
  ];

  // 分頁元件: 只有dialogStatus變更才會重新渲染
  const DialogComponentMemo = useMemo(
    () => (
      <DialogComponent
        dialogTitle={title}
        option={option}
        isOpen={dialogStatus}
        onChangeStatus={setDialogStatus}
        formData={formData}
        // setFormData={setFormData}
        fieldName={fieldName}
      ></DialogComponent>
    ),
    [dialogStatus]
  );

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
            // 每次進入對話框時清空欄位
            setFormData({
              id: null,
              todos: "",
              remarks: "",
              category: "",
              EstEndDate: "",
              username: formData.username,
            });
          }}
        />
        {/* 匯出元件 */}
        <ExportButon dataSource={dataSource} sourceLabel={sourceLabel} />
        <br />
        <Table
          columns={
            <>
              <TableColumn minWidth={100}>
                <Label>ID</Label>
              </TableColumn>
              <TableColumn minWidth={100}>
                <Label>優先順序</Label>
              </TableColumn>
              <TableColumn>
                <Label>預計完成日</Label>
              </TableColumn>
              <TableColumn minWidth={800}>
                <Label>待辦事項</Label>
              </TableColumn>
              <TableColumn minWidth={600}>
                <Label>備註</Label>
              </TableColumn>
              <TableColumn>
                <Label>建立人員</Label>
              </TableColumn>
              <TableColumn>
                <Label>功能</Label>
              </TableColumn>
            </>
          }
        >
          {currentTableData.map((e, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Label>{e.id}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.category}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.EstEndDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.todos}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.remarks}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.username}</Label>
              </TableCell>
              <TableCell>
                <div>
                  {/* 編輯功能 */}
                  <Button
                    design="Positive"
                    icon="edit"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      setTitle("編輯待辦事項");
                      setDialogStatus(true);
                      setOption("edit");
                      setFormData({
                        id: e.id,
                        todos: e.todos,
                        remarks: e.remarks,
                        category: e.category,
                        EstEndDate: e.EstEndDate,
                        username: e.username,
                      });
                    }}
                  ></Button>
                  {/* 刪除功能 */}
                  <Button
                    design="Negative"
                    icon="delete"
                    onClick={async () => {
                      await dispatch(delTodolist(e.id));
                      dispatch(getTodolist());
                    }}
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
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
      </Container>
    </MainLayout>
  );
};
