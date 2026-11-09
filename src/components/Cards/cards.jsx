import React from "react";
import PropTypes from "prop-types";

function Cards({onClick}) {
    const valueList = [0,0.5,1,2,3,5,8,13,20,40,100,"Café"]
    return (
        <div>
            {Array.from(valueList).map((item, index) => (
                <button type={"button"} onClick={()=>{onClick(item)}}>{item}</button>
            ))}
        </div>
    );
}

Cards.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default Cards;