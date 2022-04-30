import { createContext } from "react";

function noop() { return null }

export const GlobalContext = createContext({
    params: null,
    currencyNames: null,
    getDelta: noop,
    request: noop,
    lastUpdated: null,
    getLastUpdate: noop,
    numValSwitch: noop
});