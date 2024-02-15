"use client";
import React, { useReducer, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  user: null,
};

const initialContext = {
  state: initialState,
  dispatch: () => null,
  cartItems: [],
  cartDispatch: function (action) {
    throw new Error("Function is not implemented");
  },
};

const Context = createContext(initialContext);

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const cartItems = [...state, action.payload];
      window.localStorage.setItem(
        "_e_commerce_cart",
        JSON.stringify(cartItems)
      );
      return cartItems;

    case "REMOVE_FROM_CART":
      const newCartItems = state.filter((item) => {
        item.skuId !== action.payload?.skuId;
      });
      window.localStorage.setItem(
        "_e_commerce_cart",
        JSON.stringify(newCartItems)
      );
      return newCartItems;

    case "UPDATE_CART":
      const updatedCartItems = state.map((item) => {
        if (item.skuId === action.payload?.skuId) {
          return action.payload;
        }
        return item;
      });
      window.localStorage.setItem(
        "_e_commerce_cart",
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;

    case "GET_CART":
      return action.payload;

    case "CLEAR_CART":
      window.localStorage.removeItem("_e_commerce_cart");
      return [];

    default:
      return state;
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const [products, setProducts] = React.useState({});
  const [metadata, setMetaData] = React.useState({});

  const router = useRouter();

  const fetchProducts = async (type, search) => {
    try {
      // console.log(type, search)
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/products${
        type ? `?${type}=${search}` : ""
      }`;
      const { data } = await axios.get(url);
      setProducts(data.result.products);
      setMetaData(data.result.metadata);
      // console.log(data.result);
    } catch (error) {
      // console.log(error);
      toast.error("Something Went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: localStorage.getItem("_e_commerce_user")
        ? JSON.parse(localStorage.getItem("_e_commerce_user") || "{}")
        : null,
    });

    const cartItems = JSON.parse(
      window.localStorage.getItem("_e_commerce_cart") || "[]"
    );
    cartDispatch({ type: "GET_CART_ITEMS", payload: cartItems });
    return;
  }, []);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .put("/api/v1/users/logout")
            .then((res) => {
              dispatch({
                type: "LOGOUT",
                payload: null,
              });
              localStorage.removeItem("_e_commerce_user");
              router.push("/auth");
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
      return true;
    }
  );

  useEffect(() => {
    const getCSRF_token = async () => {
      const { data } = await axios("/api/v1/csrf-token");
      axios.defaults.headers["X-CSRF-Token"] = data?.result;
    };
    getCSRF_token();
  }, []);

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        cartItems,
        cartDispatch,
        products,
        setProducts,
        metadata,
        setMetaData,
        fetchProducts,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
