import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Divider, Typography } from "antd";
import {
  Button,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  Label,
} from "@ui5/webcomponents-react";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { getTodolist, delTodolist } from "../../redux/todolist/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { Container } from "../../components/styles/main";
import { ProcessPendingDialog } from "../../components/diglog";
import { Pagination } from "../../components";

// 繼承並新增username
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

export const TodolistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [formData, setFormData] = useState<FormType>({
    id: null,
    todos: "",
    remarks: "",
    username: "",
  });
  const dataSource = useSelector((state) => state.todolist.data);

  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
      const token = jwt_decode<JwtPayload>(jwt);
      setFormData({
        id: null,
        todos: "",
        remarks: "",
        username: token.username,
      });
    }
  }, []);

  const DialogComponentMemo = useMemo(
    () => (
      <ProcessPendingDialog
        title={title}
        option={option}
        isOpen={dialogState}
        onChangeStatus={setDialogState}
        formData={formData}
        setFormData={setFormData}
      ></ProcessPendingDialog>
    ),
    [dialogState, formData]
  );

  return (
    <MainLayout>
      <Container>
        <Divider orientation="left">
          <Typography.Title level={3}>本週待辦事項</Typography.Title>
        </Divider>
        <Button
          onClick={() => {
            setTitle("新增待辦事項");
            setDialogState(true);
            setOption("add");
            setFormData({
              id: null,
              todos: "",
              remarks: "",
              username: formData.username,
            });
          }}
        >
          新增
        </Button>
        <br />
        <Table
          columns={
            <>
              <TableColumn minWidth={100}>
                <Label>ID</Label>
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
          {dataSource.map((e, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Label>{e.id}</Label>
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
                      setDialogState(true);
                      setOption("edit");
                      setFormData({
                        id: e.id,
                        todos: e.todos,
                        remarks: e.remarks,
                        username: e.username,
                      });
                    }}
                  ></Button>
                  {/* 刪除功能 */}
                  <Button
                    design="Negative"
                    icon="delete"
                    onClick={() => {
                      // console.log(e.id);
                      dispatch(delTodolist(e.id));
                      dispatch(getTodolist());
                    }}
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        {/* Dialog元件 */}
        <>{DialogComponentMemo}</>
        <Pagination></Pagination>
      </Container>
    </MainLayout>
  );
};
