import React from "react";
import PropTypes from "prop-types";
import Func from "../Func/func.jsx";
import Cards from "../Cards/cards.jsx";

function Game({backlog}) {
    const[funcId, setFuncId] = React.useState(0);
    const [playerId, setPlayerId] = React.useState(0);
    const playerdata = JSON.parse(
        sessionStorage.getItem('playersData') || '{}'
    );
    const [currVote, setCurrVote] = React.useState(new Map());
    function updateVote(player, value) {
        setCurrVote(prev => {
            const newVote = new Map(prev);
            newVote.set(player, value);
            return newVote;
        });
    }
    const[currPlayer, setcurrPlayer] = React.useState(playerdata[playerId]);
    function onCardClick(value) {
        updateVote(currPlayer, value);
        const nextPlayerId = playerId + 1;
        setPlayerId(nextPlayerId);
        setcurrPlayer(playerdata[nextPlayerId]);
    }
    function nextVote(){
        setCurrVote(prev => {
            const newVote = new Map(prev);

            for (const key of newVote.keys()) {
                newVote.set(key, 0);
            }

            return newVote;
        });
        const nextPlayerId = 0;
        setPlayerId(nextPlayerId);
        setcurrPlayer(playerdata[nextPlayerId]);
        setFuncId(funcId+1);
    }
    if(!currPlayer){ // s'il n'y a plus de joueurs à faire voter
        return (
            <div>
                <h1>{backlog.projet}</h1>

                <Func backlog={backlog} funcId ={funcId}></Func>

                <h3>Résultat des votes</h3>

                {Array.from(currVote).map((item, index) => (
                    <div key={index}>{item[0]} : {item[1]}</div>
                ))}

                <button onClick={()=>{nextVote()}}>Passer a la suite</button>
            </div>
        )
    }
    else {
        if(funcId<backlog.fonctionnalites.length){ //tant qu'il reste une fonctionnalité à estimer
            return (
                <div>
                    <h1>{backlog.projet}</h1>

                    <Func backlog={backlog} funcId ={funcId}></Func>

                    <h3>Au tour de "{currPlayer}" de voter</h3>
                    <Cards onClick={onCardClick}></Cards>
                </div>
            );
        } else {
            return (
                <h1>backlog estimé</h1>
            )
        }
    }
}

Game.propTypes = {
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

export default Game;