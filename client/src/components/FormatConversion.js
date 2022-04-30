import React from "react";
import NumberFormat from "react-number-format";

export default function FormatConversion({ value }) {

    const roundTo = (num, roundTo) => {
        return +(Math.round(num + "e+" + roundTo)  + "e-" + roundTo);
    }

    if(!value){
        return null;
    }

    return(
        <NumberFormat
            displayType="text"
            value={ roundTo(value, 6) }
            thousandSeparator={true}
        />
    );
}