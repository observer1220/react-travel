import React from "react";
import { useParams } from "react-router-dom";

type MatchParams = {
  touristRouteId: string;
};

export const DetailPage: React.FC = () => {
  var params = useParams<MatchParams>();
  return <h1>旅遊路線詳情頁, 路線ID: {params.touristRouteId}</h1>;
};
