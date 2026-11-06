import React from "react";
import PropTypes from "prop-types";
import Func from "../Func/func.jsx";

function FuncList({backlog}) {
    const[funcId, setFuncId] = React.useState(0);
    return (
        <div>
            <h1>{backlog.projet}</h1>

            <Func backlog={backlog} funcId ={funcId}></Func>

            <button type={"button"} onClick={()=>setFuncId(0)}>0</button>
            <button type={"button"} onClick={()=>setFuncId(1)}>1</button>
        </div>
    );
}

FuncList.propTypes = {
    backlog: PropTypes.shape({
        projet: PropTypes.string.isRequired,
        fonctionnalites: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                titre: PropTypes.string.isRequired,
                estimation: PropTypes.number.isRequired,
            })
        )
    })
}

export default FuncList;