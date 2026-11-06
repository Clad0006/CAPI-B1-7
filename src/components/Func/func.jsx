import React from "react";
import PropTypes from "prop-types";

function FuncList({backlog,funcId}) {
    return (
        <div>
            <h2>{backlog.fonctionnalites[funcId].id}. {backlog.fonctionnalites[funcId].titre}</h2>
            {backlog.fonctionnalites[funcId].estimation!==-1 ? backlog.fonctionnalites[funcId].estimation : "non-estimé"}
        </div>
    );
}

FuncList.propTypes = {
    funcId: PropTypes.number.isRequired,
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