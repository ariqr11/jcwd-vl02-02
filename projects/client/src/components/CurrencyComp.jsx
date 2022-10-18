import React from "react";

const Currency = (props) => {

    return (
        <>Rp{props.price.toLocaleString('id')}</>
    )
};

export default Currency;