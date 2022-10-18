import React from "react";

const Datetime = (props) => {
    
    // console.log(props.value);
    let d = new Date(props.value);
    let d2 = d.toString();
    let dsplit = d2.split(' ');

    return (
        <>{dsplit[0]}, {dsplit[2]} {dsplit[1]} {dsplit[3]} - {dsplit[4]}</>
    )
};

export default Datetime;