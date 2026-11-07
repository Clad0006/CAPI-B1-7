import FuncList from "../components/FuncList/funcList.jsx";
import React from "react";


function PokerView() {
    const backdata = JSON.parse(
        sessionStorage.getItem('backlogData') || '{}'
    );
    const playerdata = JSON.parse(
        sessionStorage.getItem('playersData') || '{}'
    );
    return (
        <>
            {playerdata.map ((item, index) => (
                <div key={index}>
                    <p>Joueur {index +1} : {item}</p>
                </div>
                )
            )}
            <FuncList backlog={backdata}/>
        </>
    );
}

export default PokerView;
