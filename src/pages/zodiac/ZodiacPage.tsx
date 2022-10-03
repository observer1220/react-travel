import React, { useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Button as SAPButton } from "@ui5/webcomponents-react";
import { DatePicker, Button, Divider, Typography } from "antd";
import moment from "moment";
import locale from "antd/es/date-picker/locale/zh_TW";
import { Container } from "../../components/styles/main";

interface FormType {
  selectedDate: any;
  birthYear: any;
  birthMonth: any;
  birthDay: any;
  CenturyValue: number;
}

export const ZodiacPage: React.FC = (props) => {
  const [formData, setFormData] = useState<FormType>({
    selectedDate: moment(),
    birthYear: 1989,
    birthMonth: 3,
    birthDay: 22,
    CenturyValue: 3.87,
  });
  const [springDay, setSpringDay] = useState<any>();
  const [zodiac, setZodiac] = useState<any>();

  // 每年的立春為生肖的判斷標準，計算立春日的公式為：[Y*D+C]-L
  // 公式解讀：Y：年數的後2位 D：常量0.2422 C：世紀值，21世紀是3.87 取整數減 L：閏年數。
  // 舉例說明：2058年立春日期的計算步驟[58 ×.0.2422 + 3.87]-[(58-1)/4]=17-14=3，則2月3日立春

  // 取得當前日期
  const getNowDate = () => {
    const date = formData.selectedDate._d;
    formData.birthYear = date.getFullYear();
    formData.birthMonth = date.getMonth() + 1;
    formData.birthDay = date.getDate();

    // 執行下列方法
    getCenturyValue();
    getSpringDay();
    getZoadiac();
  };

  // 取得世紀值
  const getCenturyValue = () => {
    const _year = Math.floor(formData.birthYear / 100) + 1;
    let Century;

    switch (_year) {
      case 20:
        Century = 4.6295;
        break;
      case 21:
        Century = 3.87;
        break;
      case 22:
        Century = 4.15;
        break;
      default:
        Century = 3.87;
    }
    return Century;
  };

  // 計算該年度立春日: 2058年立春日期的計算步驟[58×.0.2422+3.87]-[(58-1)/4]=17-14=3，則2月3日立春
  const getSpringDay = () => {
    let Y = formData.birthYear % 100,
      D = 0.2422,
      C = formData.CenturyValue,
      L = (Y - 1) / 4,
      springDay = 0;
    // console.log(Y, D, C, L);
    springDay = Math.floor(Y * D + C) - Math.floor(L);
    setSpringDay(springDay);
  };

  // 取得生肖
  const getZoadiac = () => {
    const year = formData.birthYear;
    const month = formData.birthMonth;
    const day = formData.birthDay;
    const zodiacData = [
      "子鼠",
      "丑牛",
      "寅虎",
      "卯兔",
      "辰龍",
      "巳蛇",
      "午馬",
      "未羊",
      "申猴",
      "酉雞",
      "戌狗",
      "亥豬",
    ];
    let myPos = (year - 1900) % 12;
    let myZodiac = zodiacData[myPos];

    switch (month) {
      case 1:
        let _myPos = myPos - 1;
        if (_myPos < 0) {
          _myPos = 11;
        }
        myZodiac = zodiacData[_myPos];
        break;
      case 2:
        if (day < springDay) {
          let _myPos = myPos - 1;
          if (_myPos < 0) {
            _myPos = 11;
          }
          myZodiac = zodiacData[_myPos];
        }
        break;
    }
    setZodiac(myZodiac);
  };

  return (
    <MainLayout>
      <Container>
        <Divider orientation="left">
          <Typography.Title level={3} style={{ color: "white" }}>
            十二生肖推算
          </Typography.Title>
        </Divider>
        <div>
          傳統上生肖的劃分，是以二十四節氣中的立春作為交界點。以1989年為例，該年的立春為2月3日。因此2月2日出生者屬辰龍，2月3日出生者屬巳蛇。
        </div>
        <DatePicker
          defaultValue={moment()}
          locale={locale}
          style={{ width: "30%" }}
          onChange={(e) => setFormData({ ...formData, selectedDate: e })}
          placeholder="請選擇您的出身年月日..."
        ></DatePicker>
        <Button
          onClick={() => {
            getNowDate();
          }}
        >
          送出
        </Button>
        <div style={{ marginLeft: "5px" }}>
          <h3 style={{ color: "white" }}>
            {formData.birthYear}年立春之際為：2月{springDay}日，
            <span>
              您的生肖為：
              {zodiac}
            </span>
          </h3>
        </div>
      </Container>
    </MainLayout>
  );
};
