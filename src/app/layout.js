import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "../../context";
import Heading from "@/components/shared/Heading";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopHeader from "@/components/shared/TopHeader";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "ShopMonk",
  description: "ShopMonk - Get Instant License in a click",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Heading />
          <Container>
            <TopHeader />
            <div style={{ minHeight: "75vh" }}>{children}</div>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ transition: "Bounce" }}
            />
          </Container>
        </Provider>
      </body>
    </html>
  );
}
