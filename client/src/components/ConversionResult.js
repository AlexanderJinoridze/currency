import React, { useContext, useState, useEffect } from "react";
import useHttp from "../hooks/http.hook";
import FormatConversion from "./FormatConversion";
import Loader from "../layouts/Loader";
import { GlobalContext } from "../context/GlobalContext";
import { HomePageContext } from "../context/HomePageContext";

export default function ConversionResult() {
    const [toCoefficient, setToCoefficient] = useState();
    const [fromCoefficient, setFromCoefficient] = useState();
    const [result, setResult] = useState();

    const { currencyNames } = useContext(GlobalContext);
    const { amount, from, to } = useContext(HomePageContext);

    const { loading, request } = useHttp();

    useEffect(() => {
        setResult(parseFloat((toCoefficient * amount)));
    }, [toCoefficient, amount]);

    useEffect(() => {
        (async () => {
            try {
                const toCoefficient = (await request(`api.php/currency/latest?symbols=${ to }&base=${ from }`, "GET" ))[to];
                const fromCoefficient = (await request(`api.php/currency/latest?symbols=${ from }&base=${ to }`, "GET" ))[from];

                setToCoefficient(toCoefficient);
                setFromCoefficient(fromCoefficient);
            } catch(e) {}
        })();
    }, [request, from, to]);


    if(loading) {
        return(<Loader />);
    }
    
    return(
        <>
            <div className="currency-converter-result">
                <h5 className="amount-title">
                    <span><FormatConversion value={ amount } /> { currencyNames[from] } =</span>
                </h5>
                <h1 className="result-title">
                    <span><FormatConversion value={ result } /> { currencyNames[to] }</span>
                </h1>
            </div>
            <div className="selected-unit-rates">
                <div>1 <span className="is-uppercase">{ from }</span> = <FormatConversion value={ toCoefficient } /> <span className="is-uppercase">{ to }</span></div>
                <div>1 <span className="is-uppercase">{ to }</span> = <FormatConversion value={ fromCoefficient } /> <span className="is-uppercase">{ from }</span></div>
            </div>
        </>
    );
}