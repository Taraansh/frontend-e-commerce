// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "../../context";
import Heading from "@/components/shared/Heading";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopHeader from "@/components/shared/TopHeader";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "E-commerce",
//   description: "E-commerce - Get Instant License in a click",
// };

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Heading />
          <Container>
            <TopHeader />
            {children}
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
