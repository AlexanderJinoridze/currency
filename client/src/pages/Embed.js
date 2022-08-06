import React, { useEffect, useState, useRef, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Loader from "../layouts/Loader";
import FormatConversion from "../components/FormatConversion";


export default function Embed() {
    const [isLegit, setIsLegit] = useState(null);
    const [latestData, setLatestData] = useState(null);
    const [deltaData, setDeltaData] = useState(null);

    let interval = useRef(null);

    const { params, currencyNames, getDelta, request, lastUpdated, getLastUpdate, numValSwitch } = useContext(GlobalContext);

    const getData = async (currencies) => {
        try {
            const latestData = await request(`api.php/currency/latest?symbols=${ currencies.toString() }`, "GET");
            const yesterdayData = await request(`api.php/currency/yesterday?symbols=${ currencies.toString() }`, "GET");
            return { latestData, yesterdayData };
        } catch(e) {console.log(e)}
    }

    useEffect(() => {
        if(!params.currency) {
            setIsLegit(false);
            return;
        } else {
            setIsLegit(true);
        }

        var init = async () => {
            const { latestData, yesterdayData } = await getData(params.currency);
            const delta = getDelta(latestData, yesterdayData);

            getLastUpdate();

            setLatestData(latestData);
            setDeltaData(delta);
        }

        init();
        interval.current = setInterval(init, 60 * 1000);

        return ()=>{
            clearInterval(interval.current);
        }
    },[]);

    const drawEmbedList = () => {
        return(
            Object.keys(latestData).map((currencyCode,i) => {
                const currentDelta = deltaData[currencyCode];

                return(
                    <div key={ i } className="is-flex is-align-items-center py-1">
                        <div className="is-flex is-align-items-center w-one-third">
                            <img src={ `images/flags/sm/${ currencyCode }.png` } alt={ currencyNames[currencyCode] } className="mr-2" />
                            <span className="is-uppercase is-family-monospace">{ currencyCode }</span>
                        </div>
                        <div className="w-one-third">
                            <span><FormatConversion value={ latestData[currencyCode] } /></span>
                        </div>
                        <div className="w-one-third has-text-right">
                            <span className={ numValSwitch(currentDelta, "has-text-success", "has-text-danger") }>{ currentDelta }%</span>
                        </div>
                    </div>
                )
            })
        )
    }

    const drawEmbed = () => {
        if(isLegit === false){
            return <div className="p-4">Something went wrong</div>;
        } else {
            if(latestData && deltaData) {
                return(
                    <>
                        <div className="has-text-centered mb-4">
                            <span>Last updated at<br /><b>{ lastUpdated }</b></span>
                        </div>
                        <div className="is-flex is-flex-direction-column">{ drawEmbedList() }</div>
                        <div className="has-text-right  mt-4">
                            <span>Provided by <a href="http://zaza.ge" target="_blank" rel="noreferrer">ExArt.ge</a></span>
                        </div>
                    </>
                );
            } else {
                return <Loader />;
            }
        }
    }

    return(
        <div className="embed-block">{ drawEmbed() }</div>
    )
}