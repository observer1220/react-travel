import React, { useState } from "react";
import { ZodiacLayout } from "../../layouts/zodiacLayout";
import { DatePicker, Button, Divider, Typography, Row, Col } from "antd";
import moment from "moment";
import locale from "antd/es/date-picker/locale/zh_TW";
import { Container } from "../../components/styles/main";
import { Solar } from "lunar-typescript";
import styles from "./Zodiac.module.css";
import Bagua from "../../assets/Bagua.png";

interface FormType {
  selectedDate: any;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
}

interface IFullLunar {
  FullLunar: any;
  LunarDate: any;
  GanZhi: any;
  WuXing: string;
  Chong: string;
  Sha: string;
  PengZu: string;
  XiSheng: string;
  FuSheng: string;
  CaiSheng: string;
  DayYi: string[];
  DayJi: string[];
}

export const ZodiacPage: React.FC = () => {
  // 定義使用者選擇的日期與更新方法
  const [formData, setFormData] = useState<FormType>({
    selectedDate: moment(),
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,
  });

  // 定義農民曆有哪些欄位與內容的更新方法
  const [FullLunar, setFullLunar] = useState<IFullLunar>({
    FullLunar: {},
    LunarDate: new Date(),
    GanZhi: "",
    WuXing: "",
    Chong: "",
    Sha: "",
    PengZu: "",
    XiSheng: "",
    FuSheng: "",
    CaiSheng: "",
    DayYi: [],
    DayJi: [],
  });

  // 定義立春日與更新方法
  const [springDay, setSpringDay] = useState<number>(0);

  // 取得使用者選擇的特定日期
  const getNowDate = () => {
    const date = formData.selectedDate._d;

    // 將特定日期轉為純數字
    formData.birthYear = date.getFullYear();
    formData.birthMonth = date.getMonth() + 1;
    formData.birthDay = date.getDate();

    // 農曆轉換:代入出生年月日
    const solar = Solar.fromYmd(
      formData.birthYear,
      formData.birthMonth,
      formData.birthDay
    );

    // 更新農曆內容
    const Sol = solar.getLunar();
    setFullLunar({
      FullLunar: "",
      LunarDate: Sol.toString(),
      GanZhi:
        Sol.getYearInGanZhi() +
        "年 " +
        Sol.getMonthInGanZhi() +
        "月 " +
        Sol.getDayInGanZhi() +
        "日 ",
      WuXing: Sol.getDayNaYin(),
      Chong: Sol.getDayChongDesc(),
      Sha: Sol.getDaySha(),
      PengZu: Sol.getPengZuGan() + "，" + Sol.getPengZuZhi(),
      XiSheng: Sol.getDayPositionXiDesc(),
      FuSheng: Sol.getDayPositionFuDesc(),
      CaiSheng: Sol.getDayPositionCaiDesc(),
      DayYi: Sol.getDayYi(),
      DayJi: Sol.getDayJi(),
    });

    // 取得世紀值以後，將其當做立春日的參數
    getSpringDay(getCenturyValue());
  };

  // 取得世紀值
  const getCenturyValue = () => {
    const _year = Math.floor(formData.birthYear / 100) + 1;
    let Century: number = 3.87;

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
    // 這裡可以用return，因為世紀值純粹就是一個參數，不會直接顯示在HTML模板裡
    return Century;
  };

  // 計算立春日
  const getSpringDay = (CenturyValue: number) => {
    // 立春日
    let SpringDay: number = 0;
    // 出生年的後兩位數
    let DecimalBirthYear = formData.birthYear % 100;
    // 平均回歸年小數點後四位
    let DecimalTropicalYear = 0.2422;
    // 世紀值常數
    let CenturyConst = CenturyValue;
    // 閏年數:
    let LeapYear = (DecimalBirthYear - 1) / 4;
    // console.log(DecimalBirthYear, DecimalTropicalYear, CenturyConst, LeapYear);

    // 計算立春日的公式為[Y*D+C]-L
    // 2058年立春日期的計算步驟[58×.0.2422+3.87]-[(58-1)/4]=17-14=3，則2月3日立春
    SpringDay =
      Math.floor(DecimalBirthYear * DecimalTropicalYear + CenturyConst) -
      Math.floor(LeapYear);

    // 這裡不建議直接將回傳值丟給getZoadiac()，因為立春日必須顯示在HTML裡，直接在HTML寫getSpringDay()很容易出錯
    setSpringDay(SpringDay);
    // 取得立春日之後，再取得生肖
    getZoadiac();
  };

  // 取得生肖
  const getZoadiac = () => {
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
    // 計算生肖排序
    let myPos = (formData.birthYear - 1900) % 12;
    // 將生肖排序(數字)轉換為文字
    let myZodiac: string = zodiacData[myPos];

    // 以出生月份做劃分
    switch (formData.birthMonth) {
      // 出生日期在立春之後
      case 1:
        let _myPos = myPos - 1;
        if (_myPos < 0) {
          _myPos = 11;
        }
        myZodiac = zodiacData[_myPos];
        break;
      // 出生日期在立春之前
      case 2:
        if (formData.birthDay < springDay) {
          let _myPos = myPos - 1;
          if (_myPos < 0) {
            _myPos = 11;
          }
          myZodiac = zodiacData[_myPos];
        }
        break;
    }
    return myZodiac;
  };

  return (
    <ZodiacLayout>
      <Container>
        <Divider orientation="left">
          <Typography.Title level={3} style={{ color: "white" }}>
            十二生肖推算
          </Typography.Title>
        </Divider>
        <div>
          ＊傳統上生肖的劃分是以二十四節氣的立春為界。以1989年為例，該年的立春為2月3日。因此2月2日出生者屬辰龍，2月3日出生者屬巳蛇。
        </div>
        <DatePicker
          defaultValue={moment()}
          locale={locale}
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
        {springDay ? (
          <div style={{ marginLeft: "5px" }}>
            <h3 style={{ color: "white" }}>
              {formData.birthYear}年立春之際為：2月{springDay}日，
              <span>
                您的生肖為：
                {getZoadiac()}
              </span>
            </h3>
            <Row className={styles["container"]}>
              <Col xs={6} md={3} lg={2} className={styles["leftSide"]}>
                <ul>
                  <li className={styles["main"]}>
                    農曆{FullLunar.LunarDate}日
                  </li>
                  <li className={styles["side"]}>{FullLunar.GanZhi}</li>
                </ul>
              </Col>
              <Col xs={18} md={12} lg={14} className={styles["middlePart"]}>
                <ul className={styles["RowOne"]}>
                  <li>五行：{FullLunar.WuXing}</li>
                  <li>
                    沖煞：沖{FullLunar.Chong}，煞{FullLunar.Sha}
                  </li>
                  <li>彭祖：{FullLunar.PengZu}</li>
                </ul>
                <ul className={styles["RowTwo"]}>
                  <li>喜神{FullLunar.XiSheng}</li>
                  <li>福神{FullLunar.FuSheng}</li>
                  <li>財神{FullLunar.CaiSheng}</li>
                </ul>
                <ul className={styles["RowThree"]}>
                  <li>
                    <span className={styles["Yi"]}>宜</span>：
                    {FullLunar.DayYi.map((item, index) => {
                      return (index ? "、" : "") + item;
                    })}
                  </li>
                  <li>
                    <span className={styles["Ji"]}>忌</span>：
                    {FullLunar.DayJi.map((item, index) => {
                      return (index ? "、" : "") + item;
                    })}
                  </li>
                </ul>
              </Col>
              <Col xs={0} md={8} lg={8} className={styles["rightSide"]}>
                <img src={Bagua} alt="" className={styles["Bagua-logo"]} />
              </Col>
            </Row>
          </div>
        ) : (
          <div></div>
        )}
      </Container>
    </ZodiacLayout>
  );
};
