import { useForm } from "react-hook-form";
import "./ProcessPending.module.css";
import {
  Form,
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
  CheckBox,
  Switch,
} from "@ui5/webcomponents-react";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import {
  delProcessPendingList,
  editProcessPendingList,
  addProcessPendingList,
  getProcessPendingList,
} from "../../redux/processPending/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import ExcelJs from "exceljs";
import { ProcessPendingDialog } from "../../components";

interface IFormInput {
  purchaseOrderNo: any;
  purchaseOrderLine: any;
  orderType: any;
  orderNo: any;
  StandardTextCode: any;
  ProcessCode: any;
  ManufacturerCode: any;
  ProductName: any;
  ESTEndDate: any;
  ESTStartDate: any;
  ESTDeliveryDate: any;
  pickingStatus: any;
  inputQTY: any;
  completedQTY: any;
}

// interface FormType {
//   id: any;
//   todos: any;
//   remarks: any;
//   username: string;
// }

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const ProcessPendingPage: React.FC = () => {
  const jwt = useSelector((state) => state.user.token);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  // const [formData, setFormData] = useState<FormType>({
  //   id: null,
  //   todos: "",
  //   remarks: "",
  //   username: "",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = handleSubmit(async (data: IFormInput) => {
    // console.log(data);
    await dispatch(addProcessPendingList(data));
    setDialogIsOpen(false);
    dispatch(getProcessPendingList());
  });

  // 取得待辦事項清單
  const dataSource = useSelector((state) => state.processPendingList.data);
  const sourceLabel = [
    { name: "ID" },
    { name: "待辦事項" },
    { name: "備註" },
    { name: "建立人員" },
  ];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jwt) {
      // console.log(dispatch(getProcessPendingList()));
      dispatch(getProcessPendingList());

      // jwt解碼，並將解碼後的username顯示在header
      const token = jwt_decode<JwtPayload>(jwt);
      // setFormData({
      //   id: null,
      //   todos: "",
      //   remarks: "",
      //   username: token.username,
      // });
    }
  }, []);

  // 匯出至EXCEL
  const ExportBtn = () => {
    // 設定時間
    let date = new Date();
    let Today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // console.log(Today);

    // 創建試算表檔案
    const workbook = new ExcelJs.Workbook();
    // console.log(workbook);

    //在檔案中新增工作表 參數放自訂名稱
    const sheet = workbook.addWorksheet(Today);

    let outterArr: any = [];
    let innerArr: any = [];
    dataSource.forEach((item) => {
      innerArr = [item.id, item.todos, item.remarks, item.username];
      // console.log(innerArr);
      outterArr.push(innerArr);
      return innerArr;
    });
    // console.log(dataSource);

    // 在工作表指定位置、格式並用columsn與rows屬性填寫內容
    // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
    // 從A1開始
    sheet.addTable({
      name: "table名稱",
      ref: "A1",
      columns: sourceLabel,
      rows: outterArr,
    });

    workbook.xlsx.writeBuffer().then((content) => {
      const link = document.createElement("a");
      const blobData = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      link.download = `${Today}.xlsx`;
      link.href = URL.createObjectURL(blobData);
      link.click();
    });
  };

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
      <Form
        columnsXL={3}
        columnsM={1}
        columnsS={1}
        style={{ background: "#f8fcfc" }}
      >
        <FormItem label="工單單別">
          <Input {...register("orderType")} />
        </FormItem>
        <FormItem label="工單單號">
          <Input {...register("orderNo")} />
        </FormItem>
        <FormItem label="標準內文碼">
          <Input {...register("StandardTextCode")} />
        </FormItem>
        <FormItem label="製程代號">
          <Input {...register("ProcessCode")} />
        </FormItem>
        <FormItem label="廠商代號">
          <Input {...register("ManufacturerCode")} />
        </FormItem>
        <FormItem label="品名">
          <Input {...register("ProductName")} />
        </FormItem>
        <FormItem label="預計完成日">
          <DatePicker
            {...register("ESTEndDate")}
            onChange={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            primaryCalendarType="Gregorian"
          />
        </FormItem>
        <FormItem label="預計開工日">
          <DatePicker
            {...register("ESTStartDate")}
            onChange={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            primaryCalendarType="Gregorian"
          />
        </FormItem>
        <FormItem label="預交日期">
          <DatePicker
            {...register("ESTDeliveryDate")}
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
                // onClick={handleSubmit(onSubmit)}
                icon="search"
                design="Emphasized"
              >
                查詢
              </Button>
              <Button style={{ margin: "0 5px" }} onClick={ExportBtn}>
                匯出至Excel
              </Button>
              <Button
                style={{ margin: "0 5px" }}
                onClick={() => {
                  setDialogIsOpen(true);
                  // console.log(handleSubmit(onSubmit));
                }}
              >
                新增
              </Button>
              <Dialog
                style={{ width: "60%" }}
                open={dialogIsOpen}
                header={
                  <Bar>
                    <Title>新增待辦製程</Title>
                  </Bar>
                }
                footer={
                  <Bar
                    endContent={
                      <>
                        <Button
                          onClick={async () => {
                            onSubmit();
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
                <Form
                  columnsXL={3}
                  columnsL={2}
                  columnsM={2}
                  columnsS={2}
                  style={{ background: "#f8fcfc" }}
                >
                  <FormItem label="採購單號">
                    <Input
                      {...register("purchaseOrderNo", {
                        required: true,
                        maxLength: 12,
                        pattern: /^[0-9A-Za-z]+$/i,
                      })}
                    />
                  </FormItem>
                  <FormItem label="採購單項次">
                    <Input {...register("purchaseOrderLine")} />
                  </FormItem>
                  <FormItem label="廠商代號">
                    <Input {...register("ManufacturerCode")} />
                  </FormItem>
                  <FormItem label="工單單別">
                    <Input {...register("orderType")} />
                  </FormItem>
                  <FormItem label="工單單號內外徑">
                    <Input {...register("orderNo", { required: true })} />
                    {errors.orderNo?.type === "required" && <p>此欄位為必填</p>}
                  </FormItem>
                  <FormItem label="品名">
                    <Input
                      {...register("ProductName", {
                        required: true,
                      })}
                    />
                    {errors.ProductName?.type === "required" && (
                      <p>此欄位為必填</p>
                    )}
                  </FormItem>
                  <FormItem label="標準內文碼">
                    <Input
                      {...register("StandardTextCode", {
                        required: true,
                      })}
                    />
                    {errors.StandardTextCode?.type === "required" && (
                      <p>此欄位為必填</p>
                    )}
                  </FormItem>
                  <FormItem label="製程代號">
                    <Input
                      {...register("ProcessCode", {
                        required: true,
                      })}
                    />
                    {errors.ProcessCode?.type === "required" && (
                      <p>此欄位為必填</p>
                    )}
                  </FormItem>
                  <FormItem label="預計開工日">
                    <DatePicker
                      {...register("ESTStartDate", {
                        required: true,
                      })}
                      primaryCalendarType="Gregorian"
                    />
                  </FormItem>
                  <FormItem label="預計完成日">
                    <DatePicker
                      {...register("ESTEndDate", { required: true })}
                      onChange={function noRefCheck() {}}
                      onInput={function noRefCheck() {}}
                      primaryCalendarType="Gregorian"
                    />
                  </FormItem>
                  <FormItem label="投入數量">
                    <Input
                      {...register("inputQTY", {
                        required: true,
                        maxLength: 5,
                        pattern: /^[0-9]+$/i,
                      })}
                    />
                  </FormItem>
                  <FormItem label="完成數量">
                    <Input
                      {...register("completedQTY", {
                        required: true,
                        maxLength: 5,
                        pattern: /^[0-9]+$/i,
                      })}
                    />
                  </FormItem>
                  <FormItem label="預交日期">
                    <DatePicker
                      {...register("ESTDeliveryDate", { min: 18, max: 99 })}
                      onChange={function noRefCheck() {}}
                      onInput={function noRefCheck() {}}
                      primaryCalendarType="Gregorian"
                    />
                  </FormItem>
                  <FormItem label="領料狀態">
                    <Switch {...register("pickingStatus")} />
                  </FormItem>
                </Form>
              </Dialog>
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
                <Label>NO</Label>
              </TableColumn>
              <TableColumn minWidth={800}>
                <Label>採購單號</Label>
              </TableColumn>
              <TableColumn minWidth={600}>
                <Label>採購單項次</Label>
              </TableColumn>
              <TableColumn>
                <Label>廠商代號</Label>
              </TableColumn>
              <TableColumn>
                <Label>工單單別</Label>
              </TableColumn>
              <TableColumn>
                <Label>工單單號內外徑</Label>
              </TableColumn>
              <TableColumn>
                <Label>品名</Label>
              </TableColumn>
              <TableColumn>
                <Label>標準內文碼</Label>
              </TableColumn>
              <TableColumn>
                <Label>製程代號</Label>
              </TableColumn>
              <TableColumn>
                <Label>預計開工日</Label>
              </TableColumn>
              <TableColumn>
                <Label>預計完成日</Label>
              </TableColumn>
              <TableColumn>
                <Label>投入數量</Label>
              </TableColumn>
              <TableColumn>
                <Label>完成數量</Label>
              </TableColumn>
              <TableColumn>
                <Label>預交日期</Label>
              </TableColumn>
              <TableColumn>
                <Label>領料狀態</Label>
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
                <Label>{e.purchaseOrderNo}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.purchaseOrderLine}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ManufacturerCode}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.orderType}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.orderNo}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ProductName}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.StandardTextCode}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ESTStartDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ESTEndDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ESTDeliveryDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.inputQTY}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.completedQTY}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.ESTDeliveryDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{e.pickingStatus}</Label>
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
                      // setFormData({
                      //   id: e.id,
                      //   todos: e.todos,
                      //   remarks: e.remarks,
                      //   username: e.username,
                      // });
                    }}
                  ></Button>
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
                            <Button
                              onClick={async () => {
                                await dispatch(
                                  editProcessPendingList(formData)
                                );
                                setDialogIsOpen(false);
                                dispatch(getProcessPendingList());
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
                  </Dialog> */}
                  {/* 刪除功能 */}
                  <Button
                    design="Negative"
                    icon="delete"
                    onClick={() => {
                      // console.log(e.id);
                      dispatch(delProcessPendingList(e.id));
                      dispatch(getProcessPendingList());
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
