import i18n from "i18next";
import {
  CHANGE_LANGUAGE,
  ADD_LANGUAGE,
  LanguageActionTypes,
} from "./languageActions";

export interface LanguageState {
  language: "en" | "zh";
  languageList: {
    name: string;
    code: string;
  }[];
}

const defaultState: LanguageState = {
  language: "zh",
  languageList: [
    { name: "中文", code: "zh" },
    { name: "English", code: "en" },
  ],
};

// 根據Redux的設計，所有的State都是不可更改的(Immutable)
// 如果想改變State的內容，就必須創建一個新的對象，並消滅舊的對象
const variable = (state = defaultState, action: LanguageActionTypes) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      // i18n內建函數: 在Reducer調用i18n.changeLanguage()有副作用並非標準作法
      i18n.changeLanguage(action.payload);
      return { ...state, language: action.payload };
    case ADD_LANGUAGE:
      return {
        ...state,
        languageList: [...state.languageList, action.payload],
      };
    default:
      return state;
  }
};

export default variable;
