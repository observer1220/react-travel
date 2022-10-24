import { useAppDispatch } from "../../redux/hooks";
import {
  Button,
  DatePicker,
  FilterBar,
  FilterGroupItem,
  Input,
  Switch,
} from "@ui5/webcomponents-react";
import { useState } from "react";

interface PropsType {
  data: any;
}

export const MultiSearchComponent: React.FC<PropsType> = (data) => {
  const dispatch = useAppDispatch();
  const [searchData, setSearchData] = useState<any>();
  // console.log(data);

  return (
    <FilterBar>
      {data.data.map((item, idx) => (
        <FilterGroupItem label={item.label} key={idx}>
          <div>
            {item.type === "input" ? (
              <Input
                onChange={(event) => {
                  // console.log(e.target.value);
                  setSearchData({
                    ...searchData,
                    [item.name]: event.target.value,
                  });
                }}
              />
            ) : (
              <></>
            )}
            {item.type === "datepicker" ? (
              <DatePicker
                placeholder={item.placeholder}
                onChange={(event) => {
                  setSearchData({
                    ...searchData,
                    [item.name]: event.detail.value,
                  });
                }}
              />
            ) : (
              <></>
            )}
            {item.type === "switch" ? (
              <Switch
                className="ui5-content-density-compact"
                design="Graphical"
                onChange={(event) => {
                  setSearchData({
                    ...searchData,
                    [item.name]: event.target.checked,
                  });
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </FilterGroupItem>
      ))}
      <FilterGroupItem>
        <Button
          design="Emphasized"
          icon="search"
          onClick={() => {
            // 將searchData的資料丟給後端，再由後端返回相關資料
            console.log(searchData);
            // dispatch()
          }}
        >
          查詢
        </Button>
      </FilterGroupItem>
    </FilterBar>
  );
};
