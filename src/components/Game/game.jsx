import React from "react";
import PropTypes from "prop-types";
import Func from "../Func/func.jsx";
import Cards from "../Cards/cards.jsx";
import validate, { rules } from "../../functions/validation.jsx";
import downloadJSON from "../../functions/downloadJSON.jsx";

function Game({backlog}) {
    const[funcId, setFuncId] = React.useState(sessionStorage.getItem("currentFeature") ? parseInt(sessionStorage.getItem("currentFeature"))-1 : 0);
    const [features, setFeatures] = React.useState(backlog.fonctionnalites); 
    const [playerId, setPlayerId] = React.useState(0);
    const[turn, setTurn] = React.useState(1);
    const rule = sessionStorage.getItem("regle") ? sessionStorage.getItem("regle") : rules.ABSMAJ ;
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
        updateVote(currPlayer, value === "Café" ? -1 :value);
        const nextPlayerId = playerId + 1;
        setPlayerId(nextPlayerId);
        setcurrPlayer(playerdata[nextPlayerId]);
    }

    function newTurn(){
        setCurrVote(new Map());
        setPlayerId(0);
        setcurrPlayer(playerdata[0]);
        setTurn(t => t + 1);
    }
    function nextFunc(result) {
        const updated = features.map((f, i) =>
            i === funcId ? { ...f, estimation: result } : f
        );
        setFeatures(updated);
        sessionStorage.setItem(
            "backlogData",
            JSON.stringify({ ...backlog, fonctionnalites: updated })
        );
    
        setCurrVote(new Map());
        setPlayerId(0);
        setcurrPlayer(playerdata[0]);
        setTurn(1);
        setFuncId(funcId + 1);
        sessionStorage.setItem("currentFeature", funcId + 1);
    }


    function exportResult() { 
        downloadJSON(backlog.projet + "_resultat.json", {
            projet: backlog.projet,
            regle: rule,
            fonctionnalites: features.map(({ id, titre, estimation }) => ({
                id, titre, estimation,
            })),
        });
    }
    
    if(!currPlayer){ // s'il n'y a plus de joueurs à faire voter
        const result = validate(Array.from(currVote.values()), rule, turn);
        return (
            <div>
                <h1>{backlog.projet}</h1>

                <Func backlog={backlog} funcId ={funcId}></Func>

                <h3>Résultat des votes(tour {turn})</h3>

                {Array.from(currVote).map((item, index) => (
                    <div key={index}>{item[0]} : {item[1] === -1 ? "Café" : item[1]}</div>
                ))}

                {result === -1 ? (
                    <button onClick={newTurn}>Nouveau tour</button>
                ) : (
                    <>
                        <p>Validé : {result}</p>
                        <button onClick={() => nextFunc(result)}>Passer à la suite</button> 
                    </>
                )}           
         </div>
        );
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
                <div>
                    <h1>backlog estimé</h1>
                    <button onClick={exportResult}>Télécharger le résultat</button>
                </div>
            );
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