'use client';
import { useReducer, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// type Props = {
//   children: React.ReactNode;
// };

const initialState = {
  user: null,
};

// type Context = {
//   state: Record<string, any>;
//   dispatch: (action: { type: string; payload: any }) => void;
// };

const initialContext = {
  state: initialState,
  dispatch: () => null,
};

const Context = createContext(initialContext);

const userReducer = (state, action
//   state: Record<string, any>,
//   action: { type: string; payload: any }
) => {
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

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: localStorage.getItem("_e_commerce_user")
        ? JSON.parse(localStorage.getItem("_e_commerce_user") || "{}")
        : null,
    });
    return;
  }, []);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
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
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
