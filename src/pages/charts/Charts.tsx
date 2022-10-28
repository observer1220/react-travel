import React, { useEffect, useRef, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Container } from "../../components/styles/main";
import axios from "axios";
import { Button } from "@ui5/webcomponents-react";

export const ChartsPage: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const inputRef: any = useRef(null);
  useEffect(() => {
    axios
      .get(
        "https://newsapi.org/v2/top-headlines?country=tw&apiKey=abf3b20ed73441569a5f75878dfd1eda"
      )
      .then((res) => {
        // console.log(res);
        setData(res.data.articles);
      });
  }, []);

  return (
    <MainLayout>
      <Container>
        <Button
          onClick={() => {
            console.log(inputRef.current.value);
          }}
        >
          觸發
        </Button>
        <input type="text" ref={inputRef} />
        <ul>
          {data.map((item, idx) => (
            <li key={idx}>
              {idx + 1}
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </MainLayout>
  );
};
