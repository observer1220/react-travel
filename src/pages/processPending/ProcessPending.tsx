import { useForm } from "react-hook-form";
import "./ProcessPending.module.css";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormItem,
  DatePicker,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  Dialog,
  Bar,
  Title,
  TableGrowingMode,
} from "@ui5/webcomponents-react";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import {
  delTodolist,
  editTodolist,
  getTodolist,
} from "../../redux/todolist/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
interface IFormInput {
  firstName: string;
  lastName: string;
  age: number;
  example: string;
}

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const ProcessPendingPage: React.FC = () => {
  // JWT解碼
  const jwt = useSelector((state) => state.user.token);
  // 對話框欄位
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  // 表單的欄位
  const [formData, setFormData] = useState<FormType>({
    id: null,
    todos: "",
    remarks: "",
    username: "",
  });
  // 取得待辦事項清單
  const dataSource = useSelector((state) => state.todolist.data);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => {
    alert(JSON.stringify(data));
  }; // your form submit function which will invoke after successful validation

  // const createRows = (indexOffset) => {
  //   return new Array(10).fill("").map((_, index) => (
  //     <TableRow key={`${index + indexOffset} - row`}>
  //       <TableCell>
  //         <Label>{index + indexOffset}</Label>
  //       </TableCell>
  //       <TableCell>
  //         <Label>Placeholder</Label>
  //       </TableCell>
  //     </TableRow>
  //   ));
  // };
  // const [rows, setRows] = useState(createRows(1));
  // const onLoadMore = () => {
  //   setRows((prev) => [...prev, ...createRows(prev.length + 1)]);
  // };
  return (
    <>
      {/* 頂部欄位 */}
      <Bar
        endContent={
          <Button
            icon="refresh"
            onClick={() => window.location.reload()}
          ></Button>
        }
      >
        <Title>
          <strong>製程未結案查詢</strong>
        </Title>
      </Bar>
      {/* 搜尋表單 */}
      <Form columnsXL={3} style={{ background: "#f8fcfc" }}>
        <FormItem label="工單單號">
          <Input
            {...register("firstName", {
              required: true,
              maxLength: 20,
              pattern: /^[A-Za-z]+$/i,
            })}
          />
          {errors?.firstName?.type === "required" && <p>此欄位為必填</p>}
          {errors?.firstName?.type === "maxLength" && (
            <p>姓氏不能超過20個字元</p>
          )}
          {errors?.firstName?.type === "pattern" && <p>僅能輸入英文字母</p>}
        </FormItem>
        <FormItem label="工單單號">
          <Input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
          {errors?.lastName?.type === "pattern" && <p>僅能輸入英文字母</p>}
        </FormItem>
        <FormItem label="標準內文碼">
          <Input {...register("age", { min: 18, max: 99 })} />
          {errors.age && <p>需介於18 ~ 99歲之間</p>}
        </FormItem>
        <FormItem label="製程代號">
          <Input {...register("age", { min: 18, max: 99 })} />
          {errors.age && <p>需介於18 ~ 99歲之間</p>}
        </FormItem>
        <FormItem label="廠商代號">
          <Input {...register("age", { min: 18, max: 99 })} />
          {errors.age && <p>需介於18 ~ 99歲之間</p>}
        </FormItem>
        <FormItem label="品名">
          <Input {...register("age", { min: 18, max: 99 })} />
          {errors.age && <p>需介於18 ~ 99歲之間</p>}
        </FormItem>
        <FormItem label="預計完成日">
          <DatePicker
            onChange={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            primaryCalendarType="Gregorian"
          />
        </FormItem>
        <FormItem label="預計開工日">
          <DatePicker
            onChange={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            primaryCalendarType="Gregorian"
          />
        </FormItem>
        <FormItem label="預交日期">
          <DatePicker
            onChange={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            primaryCalendarType="Gregorian"
          />
        </FormItem>
      </Form>
      <div style={{ background: "#deeff2", padding: "30px 0" }}>
        <Bar
          startContent={
            <div>
              <Button
                style={{ margin: "0 5px" }}
                onClick={handleSubmit(onSubmit)}
                icon="search"
                design="Emphasized"
              >
                查詢
              </Button>
              <Button style={{ margin: "0 5px" }}>匯出至Excel</Button>
            </div>
          }
        ></Bar>
        {/* 表格 */}
        <Table
          mode="MultiSelect"
          // onLoadMore={onLoadMore}
          growing={TableGrowingMode.Scroll}
          style={{
            height: "300px",
            overflow: "auto",
          }}
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
                      setDialogIsOpen(true);
                      // console.log(e);
                      setFormData({
                        id: e.id,
                        todos: e.todos,
                        remarks: e.remarks,
                        username: e.username,
                      });
                    }}
                  ></Button>
                  <Dialog
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
                            <Button
                              onClick={async () => {
                                await dispatch(editTodolist(formData));
                                setDialogIsOpen(false);
                                dispatch(getTodolist());
                              }}
                            >
                              確認
                            </Button>
                            <Button
                              onClick={() => {
                                setDialogIsOpen(false);
                              }}
                            >
                              取消
                            </Button>
                          </>
                        }
                      />
                    }
                  >
                    <Input
                      style={{ display: "block" }}
                      value={formData.todos}
                      onChange={(e) =>
                        setFormData({ ...formData, todos: e.target.value })
                      }
                      placeholder="請輸入待辦事項..."
                    ></Input>
                    <Input
                      style={{ display: "block" }}
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      placeholder="請輸入備註..."
                    ></Input>
                  </Dialog>
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
      </div>
    </>
  );
};
