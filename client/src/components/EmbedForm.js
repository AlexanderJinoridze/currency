import React, { useContext, useState, useEffect } from "react";
import { HomePageContext } from "../context/HomePageContext";

export default function EmbedForm() {
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [embedCode, setEmbedCode] = useState("");
    const [embedHeight, setEmbedHeight] = useState(0);

    const { options } = useContext(HomePageContext);

    useEffect(() => {
        const height = 29 * selectedCurrencies.length + 120;

        setEmbedHeight(height);

        if(selectedCurrencies.length){
            setEmbedCode(`<iframe src="${ window.location.protocol }//${ window.location.host }/embed?currency=${ selectedCurrencies.toString() }" style="min-width: 300px; height: ${ height }px; border-radius: 16px" frameborder="0"></iframe>`);
        } else {
            setEmbedCode("");
        }
    },[selectedCurrencies]);

    return(
        <div className="section-container embed-form">
            <div className="has-text-centered mb-5">
                <h3 className="title is-3 mb-1">Generate Embed</h3>
                <span>Include our widget in your webpage</span>
            </div>
            <div className="notification is-warning is-light">The values will be calculated in relation to <b>1 US Dollar</b></div>
            <button
                className="button is-light mb-4"
                onClick={ () => setSelectedCurrencies([]) }
            >Reset</button>
            <div className="currency-list">
                {
                    options.map((v, i) =>
                        <div key={i} className="currency-list-item">
                            <label className="checkbox w-full is-flex is-align-items-center">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    value={ v.value }
                                    checked={ selectedCurrencies.includes(v.value) }
                                    onChange={
                                        (e)=>{
                                            let result = [...selectedCurrencies];
                                            if(e.target.checked){
                                                result.push(e.target.value);
                                            } else {
                                                result.splice(selectedCurrencies.indexOf(e.target.value),1);
                                            }
                                            setSelectedCurrencies(result);
                                        }
                                    }
                                />
                                <img src={ `images/flags/sm/${ v.value }.png` } alt={ v.label } className="mr-2" />
                                <span className="is-family-monospace"><span className="is-uppercase">{v.value}</span> - {v.label}</span>
                            </label>
                        </div>
                    )
                }
            </div>
            {
                selectedCurrencies.length?
                    <>
                        <pre>
                            { `<iframe src="${ window.location.protocol }//${ window.location.host }/embed?currency=` }
                            <b>{ selectedCurrencies.toString() }</b>
                            { `" style="min-width: 300px; height: ${ embedHeight }px; border-radius: 16px" frameborder="0"></iframe>` }
                        </pre>
                        <button
                            className="button is-primary mt-4"
                            onClick={ () => {
                                navigator.clipboard.writeText(embedCode);
                                alert("Copied successfully!");
                            }}
                        >Copy embed code</button>
                    </>
                :
                <pre>Select at least one currency to generate embed code</pre>
            }
        </div>
    )
}