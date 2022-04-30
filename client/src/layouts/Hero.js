import React, { useContext } from "react";
import FormatConversion from "../components/FormatConversion";
import { GlobalContext } from "../context/GlobalContext";
import { HomePageContext } from "../context/HomePageContext";

export default function Hero() {
    const { currencyNames } = useContext(GlobalContext);
    const { amount, from, to } = useContext(HomePageContext);

    return(
        <section className="hero is-medium is-primary">
            <div className="hero-body has-text-centered">
                <p className="title mb-6">
                    <span><FormatConversion value={ amount } /> <span className="is-uppercase">{ from }</span> to <span className="is-uppercase">{ to }</span> - Convert { currencyNames[from] } to { currencyNames[to] }</span>
                </p>
                <p className="subtitle">ExArt Currency Converter</p>
            </div>
        </section>
    )
}