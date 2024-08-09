import { createContext, useEffect, useState } from "react";
import SAIA from "./media/logo/saia_logo.png";
import DefaultLoginLogo from "./media/illustrations/login-logo.svg";
import System from "./models/system";

export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");
  const [loginLogo, setLoginLogo] = useState("");
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  useEffect(() => {
    setLogo(SAIA);
    setLoginLogo(DefaultLoginLogo);
    setIsCustomLogo(false);
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo, loginLogo, isCustomLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
