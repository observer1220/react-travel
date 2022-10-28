import React, { useReducer } from "react";
import { Button, FlexBox } from "@ui5/webcomponents-react";

export const ScoringComponents: React.FC = () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return { count: state.count + 1, showText: state.showText };
      case "toggleShowText":
        return { count: state.count, showText: !state.showText };
      case "DECREMENT":
        return { count: state.count - 1, showText: state.showText };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, { count: 0, showText: true });
  return (
    <FlexBox>
      <Button
        icon="up"
        design="Emphasized"
        onClick={() => {
          dispatch({ type: "INCREMENT" });
          dispatch({ type: "toggleShowText" });
        }}
      />
      <div style={{ margin: "0 5px" }}>
        <h2>{state.count}</h2>
      </div>
      <Button
        icon="down"
        design="Emphasized"
        onClick={() => {
          dispatch({ type: "DECREMENT" });
          dispatch({ type: "toggleShowText" });
        }}
      />
    </FlexBox>
  );
};
