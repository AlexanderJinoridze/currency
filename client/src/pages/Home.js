import React, { useState, useEffect, useContext } from "react";
import Header from "../layouts/Header";
import Hero from "../layouts/Hero";
import Converter from "../components/Converter";
import ExchangeRates from "../components/ExchangeRates";
import EmbedForm from "../components/EmbedForm";
import Footer from "../layouts/Footer";

import { GlobalContext } from "../context/GlobalContext";
import { HomePageContext } from "../context/HomePageContext";

import Loader from "../layouts/Loader";


export default function Home() {

    const { params, currencyNames } = useContext(GlobalContext);

    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState(null);

    const [amount, setAmount] = useState(() => {
        const amountParam = params.amount;
        if(Number(amountParam)) {
            return amountParam;
        }

        return 1;
    });

    const [from, setFrom] = useState(() => {
        const fromParam = params.from;
        if(currencyNames[fromParam]) {
            return fromParam;
        }
        
        return localStorage.getItem("from") || "usd";
    });

    const [to, setTo] = useState(() => {
        const toParam = params.to;
        if(currencyNames[toParam]) {
            return toParam;
        }
        
        return localStorage.getItem("to") || "sgd";
    });

    const drawOption = (value, label) => (
        <>
            <img src={ `images/flags/sm/${ value }.png` } alt={ label } className="mr-3" />
            <span className="is-text-overflow is-family-monospace"><span className="is-uppercase">{ value }</span> - { label }</span>
        </>
    )

    useEffect(() => {
        let result = [];
        for (const [value, label] of Object.entries(currencyNames)) {
            result.push({ value, label });
        }
        setOptions(result);


        localStorage.setItem("from", from);
        localStorage.setItem("to", to);
    }, []);

    useEffect(() => {
        if(options) {
            setLoading(false);
        }
    }, [options]);


    if(loading){
        return(<Loader />)
    }

    return(
        <HomePageContext.Provider value={{
            options,
            amount, setAmount,
            from, setFrom,
            to, setTo,
            drawOption
        }}>
            <Header />
            <Hero />
            <div className="container">
                <Converter />
                <ExchangeRates />
                <EmbedForm />
            </div>
            <Footer />
        </HomePageContext.Provider>
    )
}