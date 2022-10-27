import { useEffect } from "react";
import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  SignInPage,
  RegisterPage,
  DetailPage,
  SearchPage,
  ShoppingCartPage,
  PlaceOrderPage,
  TodolistPage,
  ProcessPendingPage,
  ZodiacPage,
  ChartsPage,
} from "./pages";
import { Navigate } from "react-router-dom";
import { useSelector, useAppDispatch } from "./redux/hooks";
import {
  checkout,
  clearShoppingCartItem,
  getShoppingCart,
} from "./redux/shoppingCart/slice";
// 以下是Styled-components的引用
import { ThemeProvider } from "styled-components";
import { BackTop, Drawer, Affix } from "antd";
import { changeDrawerState } from "./redux/shoppingCart/slice";
import { ProductList } from "./components/productList/index";
import { PaymentCard } from "./components";

// 僅授權用戶可造訪
const PrivateRoute = ({ children }) => {
  const jwt = useSelector((state) => state.user.token);
  // 此處僅為課程講解方便，實務上會更嚴謹
  return jwt ? children : <Navigate to="/signin"></Navigate>;
};

const theme = {
  colors: {
    header: "#68BE8D",
    body: "#fff",
    footer: "#003333",
  },
};

function App() {
  const loading = useSelector((state) => state.shoppingCart.loading);
  const jwt = useSelector((state) => state.user.token) as string;
  const drawerState = useSelector((state) => state.shoppingCart.drawer);
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(changeDrawerState(false));
  };

  useEffect(() => {
    if (jwt) {
      dispatch(getShoppingCart(jwt));
    }
  }, [dispatch, jwt]);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.App}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/detail/:touristRouteId" element={<DetailPage />} />
            <Route path="/search/:keywords" element={<SearchPage />} />
            <Route
              path="/shoppingCart"
              element={
                <PrivateRoute>
                  <ShoppingCartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/placeOrder"
              element={
                <PrivateRoute>
                  <PlaceOrderPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/todolist"
              element={
                <PrivateRoute>
                  <TodolistPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zodiac"
              element={
                <PrivateRoute>
                  <ZodiacPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/process_pending"
              element={
                <PrivateRoute>
                  <ProcessPendingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/charts"
              element={
                <PrivateRoute>
                  <ChartsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<h1>404 NOT FOUND</h1>} />
          </Routes>
        </BrowserRouter>
        <BackTop />
        <Drawer
          title="購物車清單"
          placement="left"
          onClose={onClose}
          closable={false}
          visible={drawerState}
          width={"35%"}
        >
          <ProductList
            data={shoppingCartItems.map((state) => state.touristRoute)}
          />
          <Affix>
            <div className={styles["payment-card-container"]}>
              <PaymentCard
                loading={loading}
                originalPrice={shoppingCartItems
                  .map((state) => state.originalPrice)
                  .reduce((a, b) => a + b, 0)}
                price={shoppingCartItems
                  .map(
                    (state) =>
                      state.originalPrice *
                      (state.discountPresent ? state.discountPresent : 1)
                  )
                  .reduce((a, b) => a + b, 0)}
                onCheckout={() => {
                  if (shoppingCartItems.length <= 0) {
                    return;
                  }
                  dispatch(checkout(jwt));
                }}
                onShoppingCartClear={() => {
                  dispatch(
                    clearShoppingCartItem({
                      jwt,
                      itemIds: shoppingCartItems.map((s) => s.id),
                    })
                  );
                }}
              />
            </div>
          </Affix>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}

export default App;
