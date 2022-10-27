module.exports = {
    "preset": "ts-jest",
    "verbose": false,
    "transform": {
      "^.+\\.(ts|tsx)?$": "ts-jest",
      "^.+\\.(js|jsx)?$": "babel-jest",
      ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
      "./jest.setup.js"
    ],
    "transformIgnorePatterns": [
      "node_modules/(?!(@ui5|lit-html)).*\\.js$"
    ],
    "moduleNameMapper": {
      "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
      "^uuid$": "uuid",
      "antd/es/(.*)": "antd/lib/$1",
      "\\.(css|scss|sass|less)$": "identity-obj-proxy"
    }
};