import { createContext } from "react";

function noop() { return null }

export const HomePageContext = createContext({
    options: null,
    amount: null,
    setAmount: noop,
    from: null,
    setFrom: noop,
    to: null,
    setTo: noop,
    drawOption: noop
});