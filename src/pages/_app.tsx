import { type AppType } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import "../styles/Calendar.css"
import "../styles/Spinner.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ChakraProvider>
     <Component {...pageProps} />;
  </ChakraProvider>
};

export default api.withTRPC(MyApp);
