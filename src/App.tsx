import React, { useEffect } from "react";
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
} from "./pages";
import { Navigate } from "react-router-dom";
import { useSelector, useAppDispatch } from "./redux/hooks";
import { getShoppingCart } from "./redux/shoppingCart/slice";

// 僅授權用戶可造訪
const PrivateRoute = ({ children }) => {
  const jwt = useSelector((state) => state.user.token);
  // 此處僅為課程講解方便，實務上會更嚴謹
  return jwt ? children : <Navigate to="/signin"></Navigate>;
};

function App() {
  const jwt = useSelector((state) => state.user.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getShoppingCart(jwt));
    }
  }, [jwt]);

  return (
    <div className={styles.App}>
      {/* react-router-dom V6: 不支援 component={HomePage} */}
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
          <Route path="*" element={<h1>404 NOT FOUND</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
