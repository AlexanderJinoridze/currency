import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { HomePageContext } from "../context/HomePageContext";
import FormatConversion from "../components/FormatConversion";
import Loader from "../layouts/Loader";
import SelectElement from "./SelectElement";
import useHttp from "../hooks/http.hook";

export default function ExchangeRates() {
    const [currencyList, setCurrencyList] = useState({});
    const [currencyDiff, setCurrencyDiff] = useState({});
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [currencies, setCurrencies] = useState(["sgd", "usd", "gel"]);
    const [base, setBase] = useState("eur");

    const { request, loading } = useHttp();

    const { currencyNames, getDelta, numValSwitch } = useContext(GlobalContext);
    const { options, drawOption } = useContext(HomePageContext);

    useEffect(() => {
        if(base && currencies){
            (async () => {
                try {
                    const fetchedCurrencies = await request(`api.php/currency/latest?symbols=${ currencies }&base=${ base }`, "GET" );
                    const fetchedYesterday = await request(`api.php/currency/yesterday?symbols=${ currencies }&base=${ base }`, "GET" );

                    const delta = getDelta(fetchedCurrencies, fetchedYesterday);

                    const newOptions = options.filter(function( obj ) {
                        return ![...currencies, base].includes(obj.value);
                    });

                    setCurrencyList(fetchedCurrencies);
                    setCurrencyDiff(delta);
                    setFilteredOptions(newOptions);
                } catch(e) {}
            })();
        }
    }, [options, request, base, currencies]);

    return(
        <div className="section-container exchange-rate-table">
            <div>
                <div className="column p-0 is-one-third">
                    <span>Base</span>
                    <SelectElement
                        value={ base }
                        options={ options }
                        onChange={
                            (value) => {
                                if(currencies.includes(value)){
                                    currencies.splice(currencies.indexOf(value), 1);
                                    setCurrencies([...currencies]);
                                }
                                setBase(value);
                            }
                        }
                        drawOption={ drawOption }
                    />
                </div>
            </div>
            {loading && <Loader />}
            <div className="is-flex is-flex-direction-column my-4">
                {
                    currencies.length?
                    <>
                    
                        <div className="exchange-table-header">
                            <span></span>
                            <span>Amount</span>
                            <span>Change (24h)</span>
                        </div>
                        {
                            currencies.map((key, index) => {
                                const currDiff = currencyDiff[key];
                                return(
                                    <div
                                        className="exchange-table-row"
                                        key={ index }
                                        onClick={
                                            () => {
                                                currencies.splice(currencies.indexOf(key), 1, !currencies.includes(base)? base : null);
                                                setBase(key);
                                                setCurrencies([...currencies]);
                                            }
                                        }
                                    >
                                        <div className="is-flex is-align-items-center">
                                            <img className="mr-2" src={ `images/flags/md/${ key }.png` } alt={ currencyNames[key] } />
                                            <span>{ currencyNames[key] }</span>
                                        </div>
                                        <span><FormatConversion value={ currencyList[key] } /></span>
                                        <div>
                                            { currDiff && <span className={ numValSwitch(currDiff, "has-text-success", "has-text-danger") }>{ currDiff }%</span> }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </>
                    :
                    <span>No currencies selected</span>
                }
            </div>
            <div>
                <div className="column p-0 is-one-third">
                    <SelectElement
                        options={ filteredOptions }
                        onChange={ (value) => setCurrencies([...currencies, value]) }
                        drawOption={ drawOption }
                        drawButton={ () => <button className="button button-big w-full is-primary">Add new currency</button> }
                    />
                </div>
            </div>
        </div>
    )
}