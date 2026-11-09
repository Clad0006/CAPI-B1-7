import Game from "../components/Game/game.jsx";
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
            <Game backlog={backdata}/>
        </>
    );
}

export default PokerView;
