import React, { useContext } from "react";
import NumberFormat from "react-number-format";
import { GlobalContext } from "../context/GlobalContext";
import { HomePageContext } from "../context/HomePageContext";
import SelectElement from "./SelectElement";
import ConversionResult from "./ConversionResult";

export default function Converter() {
    const { lastUpdated } = useContext(GlobalContext);
    const { options, amount, setAmount, from, setFrom, to, setTo, drawOption } = useContext(HomePageContext);

    const handleFromChange = (value) => {
        setFrom(value);
        localStorage.setItem("from", value);
    }

    const handleToChange = (value) => {
        setTo(value);
        localStorage.setItem("to", value);
    }

    const switchCurrencies = () => {
        let prevFrom = from;
        setFrom(to);
        setTo(prevFrom);
        localStorage.setItem("from", to);
        localStorage.setItem("to", prevFrom);
    }

    return(
        <div className="section-container converter-box box">
            <div className="columns is-align-items-end">
                <div className="column">
                    <label className="label">Amount</label>
                    <div className="control">
                        <NumberFormat
                            displayType="input"
                            className="input"
                            value={ amount }
                            thousandSeparator={true}
                            decimalScale={2}
                            onValueChange={ values => setAmount(values.floatValue) } />
                    </div>
                </div>
                <div className="column">
                    <label className="label">From</label>
                    <div className="control">
                        <SelectElement
                            value={ from }
                            options={ options }
                            onChange={ handleFromChange }
                            drawOption={ drawOption }
                        />
                    </div>
                </div>
                <div className="column is-flex-grow-0">
                    <div className="control">
                        <button
                            className="button is-primary"
                            onClick={ switchCurrencies }
                        >
                            <span className="icon is-medium">
                                <i className="icon-switch"></i>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="column">
                    <label className="label">To</label>
                    <div className="control">
                        <SelectElement
                            value={ to }
                            options={ options }
                            onChange={ handleToChange }
                            drawOption={ drawOption }
                        />
                    </div>
                </div>
            </div>
            <div className="converter-box-bottom">
                <ConversionResult />
            </div>
            <div className="mt-4 has-text-grey has-text-right">
                <span>Last updated in: <b>{ lastUpdated }</b>, Data taken from: <a href="https://openexchangerates.org/" target="_blank" rel="noreferrer">openexchangerates.org</a></span>
            </div>
        </div>
    )
}