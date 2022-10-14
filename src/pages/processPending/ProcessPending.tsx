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
  Bar,
  Title,
} from "@ui5/webcomponents-react";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  delProcessPendingList,
  editProcessPendingList,
  addProcessPendingList,
  getProcessPendingList,
} from "../../redux/processPending/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import ExcelJs from "exceljs";
import { DialogComponent } from "../../components/diglog";

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

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const ProcessPendingPage: React.FC = () => {
  const jwt = useSelector((state) => state.user.token);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogStatus, setDialogStatus] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    todos: "",
    remarks: "",
    category: "",
    EstEndDate: "",
    username: "",
  });

  // 對話框欄位設定
  const [fieldName] = useState([
    {
      label: "採購單號",
      placeholder: "請輸入採購單號...",
      name: "purchaseOrderNo",
      type: "input",
    },
    {
      label: "採購單項次",
      placeholder: "請輸入採購單項次...",
      name: "purchaseOrderLine",
      type: "input",
    },
    {
      label: "廠商代號",
      placeholder: "請輸入廠商代號...",
      name: "ManufacturerCode",
      type: "input",
    },
    {
      label: "工單單別",
      placeholder: "請輸入工單單別...",
      name: "orderType",
      type: "input",
    },
    {
      label: "工單單號內外徑",
      placeholder: "請輸入工單單號內外徑...",
      name: "orderNo",
      type: "input",
    },
    {
      label: "品名",
      placeholder: "請輸入品名...",
      name: "ProductName",
      type: "input",
    },
    {
      label: "標準內文碼",
      placeholder: "請輸入標準內文碼...",
      name: "StandardTextCode",
      type: "input",
    },
    {
      label: "製程代號",
      placeholder: "請輸入製程代號...",
      name: "ProcessCode",
      type: "input",
    },
    {
      label: "預計開工日",
      placeholder: "請選擇預計開工日...",
      name: "ESTStartDate",
      type: "datepicker",
    },
    {
      label: "預計完成日",
      placeholder: "請選擇預計完成日...",
      name: "ESTEndDate",
      type: "datepicker",
    },
    {
      label: "投入數量",
      placeholder: "請輸入投入數量...",
      name: "inputQTY",
      type: "input",
    },
    {
      label: "完成數量",
      placeholder: "請輸入完成數量...",
      name: "completedQTY",
      type: "input",
    },
    {
      label: "預交日期",
      placeholder: "請選擇預交日期...",
      name: "ESTDeliveryDate",
      type: "datepicker",
    },
    {
      label: "領料狀態",
      placeholder: "",
      name: "pickingStatus",
      type: "switch",
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = handleSubmit(async (data: IFormInput) => {
    // console.log(data);
    await dispatch(addProcessPendingList(data));
    setDialogStatus(false);
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
      dispatch(getProcessPendingList());
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
    let date = new Date();
    let Today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // console.log(Today);

    // 創建試算表檔案
    const workbook = new ExcelJs.Workbook();

    //在檔案中新增工作表 參數放自訂名稱
    const sheet = workbook.addWorksheet(Today);

    let outterArr: any = [];
    let innerArr: any = [];
    dataSource.forEach((item) => {
      innerArr = [item.orderType, item.todos, item.remarks, item.username];
      outterArr.push(innerArr);
      return innerArr;
    });
    // console.log(dataSource);

    // 在工作表指定位置、格式並用columsn與rows屬性填寫內容從A1開始
    // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
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

  // 分頁元件: 只有dialogStatus及formData變更才會重新渲染
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
    [dialogStatus, formData]
  );

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
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
        columnsM={2}
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
      {/* 表格區域 */}
      <div style={{ background: "#deeff2", padding: "30px 0" }}>
        <div style={{ margin: "5px", float: "right" }}>
          <Button style={{ margin: "0 5px" }} icon="search" design="Emphasized">
            查詢
          </Button>
          <Button style={{ margin: "0 5px" }} onClick={ExportBtn}>
            匯出至Excel
          </Button>
          <Button
            icon="add"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setTitle("新增項目");
              setDialogStatus(true);
              setOption("add");
              setFormData({
                purchaseOrderNo: "",
                purchaseOrderLine: "",
                ManufacturerCode: "",
                orderType: "",
                orderNo: "",
                ProductName: "",
                StandardTextCode: "",
                ProcessCode: "",
                ESTStartDate: "",
                ESTEndDate: "",
                inputQTY: "",
                completedQTY: "",
                ESTDeliveryDate: "",
                pickingStatus: "",
              });
            }}
          />
        </div>
        {/* 表格 */}
        <Table
          mode="MultiSelect"
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
          {dataSource.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Label>{item.id}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.purchaseOrderNo}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.purchaseOrderLine}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ManufacturerCode}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.orderType}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.orderNo}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ProductName}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.StandardTextCode}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ESTStartDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ESTEndDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ESTDeliveryDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.inputQTY}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.completedQTY}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.ESTDeliveryDate}</Label>
              </TableCell>
              <TableCell>
                <Label>{item.pickingStatus}</Label>
              </TableCell>
              <TableCell>
                <div>
                  {/* 編輯功能 */}
                  <Button
                    design="Positive"
                    icon="edit"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      setTitle("編輯項目");
                      setDialogStatus(true);
                      setOption("edit");
                      setFormData({
                        purchaseOrderNo: item.purchaseOrderNo,
                        purchaseOrderLine: item.purchaseOrderLine,
                        ManufacturerCode: item.ManufacturerCode,
                        orderType: item.orderType,
                        orderNo: item.orderNo,
                        ProductName: item.ProductName,
                        StandardTextCode: item.StandardTextCode,
                        ProcessCode: item.ProcessCode,
                        ESTStartDate: item.ESTStartDate,
                        ESTEndDate: item.ESTEndDate,
                        inputQTY: item.inputQTY,
                        completedQTY: item.completedQTY,
                        ESTDeliveryDate: item.ESTDeliveryDate,
                        pickingStatus: item.pickingStatus,
                      });
                    }}
                  ></Button>
                  {/* 刪除功能 */}
                  <Button
                    design="Negative"
                    icon="delete"
                    onClick={() => {
                      dispatch(delProcessPendingList(item.id));
                      dispatch(getProcessPendingList());
                    }}
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        {/* Dialog Component */}
        <>{DialogComponentMemo}</>
        {/* 
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
              {errors.ProductName?.type === "required" && <p>此欄位為必填</p>}
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
              {errors.ProcessCode?.type === "required" && <p>此欄位為必填</p>}
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
            </FormItem> */}
      </div>
    </div>
  );
};
