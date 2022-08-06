import React, { useEffect, useState } from "react";
import useHttp from "./hooks/http.hook";
import { GlobalContext } from "./context/GlobalContext";
import useRoutes from "./routes";
import Loader from "./layouts/Loader";


function App() {
    const getSearchParameters = () => {
        var prmstr = window.location.search.substr(1);
        return prmstr !== null && prmstr !== "" ? transformToAssocArray(prmstr) : {};
    }

    const transformToAssocArray = (prmstr) => {
        var params = {};
        var prmarrs = prmstr.toLowerCase().split("&");
        prmarrs.forEach((prmarr) => {
            var tmparr = prmarr.split("=");

            if (tmparr[1].indexOf(",") >= 0) {
                tmparr[1] = tmparr[1].split(",");
            }
            params[tmparr[0]] = tmparr[1];
        });
        return params;
    }

    const params = getSearchParameters();

    const [loading, setLoading] = useState(true);
    const [currencyNames, setCurrencyNames] = useState(null);
    const [lastUpdated, setLastUpdated] = useState();

    const { request } = useHttp();
    const routes = useRoutes();

    const getCurrencies = async () => {
        try {
            const fetchedCurrencyNames = await request("api.php/currency/currency", "GET");
            setCurrencyNames(fetchedCurrencyNames);
        } catch (e) { }
    }

    const diffPers = (a, b) => (((a - b) / ((a > b) ? a : b)) * 100).toFixed(2);

    const getDelta = (a, b) => {
        const delta = {};
        Object.keys(a).forEach((key) => {
            delta[key] = diffPers(a[key], b[key])
        });

        return delta;
    }

    const numValSwitch = function (num = 0, upzero = "", subzero = "", zero = "") {
        if (num === 0) {
            return zero;
        } else if (num > 0) {
            return upzero;
        } else if (num < 0) {
            return subzero;
        }
    }

    const getLastUpdate = async () => {
        const timestamp = await request(`api.php/currency/timestamp`, "GET");
        setLastUpdated(new Date(timestamp * 1000).toLocaleString("en-GB"));
    }

    useEffect(() => {
        if (currencyNames) {
            setLoading(false);
        }
    }, [currencyNames]);

    useEffect(() => {
        getCurrencies();
        getLastUpdate();
    }, [request]);

    if (loading) {
        return (<Loader />)
    }

    return (
        <GlobalContext.Provider value={{
            params,
            currencyNames,
            getDelta,
            request,
            lastUpdated,
            getLastUpdate,
            numValSwitch
        }}>
            {routes}
        </GlobalContext.Provider>
    )
}

export default App;


