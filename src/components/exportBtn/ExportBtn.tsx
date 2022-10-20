import { Button } from "@ui5/webcomponents-react";
import styles from "./ExportBtn.module.scss";
import ExcelJs from "exceljs";

interface PropsType {
  dataSource: any;
  sourceLabel: any;
}

export const ExportButon: React.FC<PropsType> = ({
  dataSource,
  sourceLabel,
}) => {
  const ExportBtn = () => {
    // 檔案名稱為日期
    let date = new Date();
    let Today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    // 創建試算表檔案
    const workbook = new ExcelJs.Workbook();

    //在檔案中新增工作表 參數放自訂名稱
    const sheet = workbook.addWorksheet(Today);

    let rows: any = [];
    let column: any = [];

    // 資料陣列
    dataSource.forEach((item: any) => {
      column = [
        item.id,
        item.category,
        item.EstEndDate,
        item.todos,
        item.remarks,
        item.username,
      ];
      rows.push(column);
    });
    console.log(rows);

    // 在工作表指定位置、格式並用columsn與rows屬性填寫內容從A1開始
    // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
    sheet.addTable({
      name: "table",
      ref: "A1",
      columns: sourceLabel,
      rows: rows,
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
    <Button
      style={{ margin: "0 5px" }}
      onClick={() => {
        ExportBtn();
      }}
    >
      匯出
    </Button>
  );
};
