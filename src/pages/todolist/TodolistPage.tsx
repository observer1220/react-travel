import React, { useEffect, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Divider, Typography } from "antd";
import {
  Button as SAPButton,
  Input as SAPInput,
  Dialog,
  Bar,
  Title,
  Table as SAPTable,
  TableColumn,
  TableRow,
  TableCell,
  Label,
} from "@ui5/webcomponents-react";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import {
  getTodolist,
  addTodolist,
  editTodolist,
  delTodolist,
} from "../../redux/todolist/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { Container } from "../../components/styles/main";
import { ProcessPendingDialog } from "../../components/diglog";

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

export const TodolistPage: React.FC = (props) => {
  // JWT解碼
  const jwt = useSelector((state) => state.user.token);
  // 表單的欄位
  const [formData, setFormData] = useState<FormType>({
    id: null,
    todos: "",
    remarks: "",
    username: "",
  });
  // 對話框欄位
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  // 取得待辦事項清單
  const dataSource = useSelector((state) => state.todolist.data);
  // console.log(dataSource);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
      // jwt解碼，並將解碼後的username顯示在header
      const token = jwt_decode<JwtPayload>(jwt);
      setFormData({
        id: null,
        todos: "",
        remarks: "",
        username: token.username,
      });
    }
  }, []);
  return (
    <MainLayout>
      <Container>
        <Divider orientation="left">
          <Typography.Title level={3}>本週待辦事項</Typography.Title>
        </Divider>
        <SAPInput
          style={{ width: "30%" }}
          value={formData.todos}
          onChange={(e) => setFormData({ ...formData, todos: e.target.value })}
          placeholder="請輸入待辦事項..."
        ></SAPInput>
        <SAPInput
          style={{ width: "30%" }}
          value={formData.remarks}
          onChange={(e) =>
            setFormData({ ...formData, remarks: e.target.value })
          }
          placeholder="請輸入備註..."
        ></SAPInput>
        <SAPButton
          onClick={() => {
            // console.log(formData);
            dispatch(addTodolist(formData));
            setFormData({
              id: null,
              todos: "",
              remarks: "",
              username: formData.username,
            });
          }}
        >
          送出
        </SAPButton>
        <br />
        <SAPTable
          style={{ background: "red" }}
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
                  <SAPButton
                    design="Positive"
                    icon="edit"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      setDialogIsOpen(true);
                      // console.log(e);
                      setFormData({
                        id: e.id,
                        todos: e.todos,
                        remarks: e.remarks,
                        username: e.username,
                      });
                    }}
                  ></SAPButton>
                  <ProcessPendingDialog
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                  ></ProcessPendingDialog>
                  {/* <Dialog
                    open={dialogIsOpen}
                    header={
                      <Bar>
                        <Title>編輯待辦事項</Title>
                      </Bar>
                    }
                    footer={
                      <Bar
                        endContent={
                          <>
                            <SAPButton
                              onClick={async () => {
                                await dispatch(editTodolist(formData));
                                setDialogIsOpen(false);
                                dispatch(getTodolist());
                              }}
                            >
                              確認
                            </SAPButton>
                            <SAPButton
                              onClick={() => {
                                setDialogIsOpen(false);
                              }}
                            >
                              取消
                            </SAPButton>
                          </>
                        }
                      />
                    }
                  >
                    <SAPInput
                      style={{ display: "block" }}
                      value={formData.todos}
                      onChange={(e) =>
                        setFormData({ ...formData, todos: e.target.value })
                      }
                      placeholder="請輸入待辦事項..."
                    ></SAPInput>
                    <SAPInput
                      style={{ display: "block" }}
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      placeholder="請輸入備註..."
                    ></SAPInput>
                  </Dialog> */}
                  {/* 刪除功能 */}
                  <SAPButton
                    design="Negative"
                    icon="delete"
                    onClick={() => {
                      // console.log(e.id);
                      dispatch(delTodolist(e.id));
                      dispatch(getTodolist());
                    }}
                  ></SAPButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </SAPTable>
      </Container>
    </MainLayout>
  );
};
