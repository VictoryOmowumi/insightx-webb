import React, { useEffect, useState } from "react";
// import Loading from "./Loading";
import DesignerContextProvider from "@/context/DesignerContext";
const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  // if (loading) return <Loading />;
  return (
    <DesignerContextProvider>
      <div className=" flex flex-col gap-4 md:mx-1 ">{children}</div>
    </DesignerContextProvider>
  );
};

export default Layout;
