import React from "react";
import PropTypes from "prop-types";
import Func from "../Func/func.jsx";
import Cards from "../Cards/cards.jsx";
import validate, { rules } from "../../functions/validation.jsx";

function Game({backlog}) {
    const[funcId, setFuncId] = React.useState(0);
    const [playerId, setPlayerId] = React.useState(0);
    const[turn, setTurn] = React.useState(1);
    const rule = rules.ABSMAJ;
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

    function nextFunc(){
        setCurrVote(new Map());
        setPlayerId(0);
        setcurrPlayer(playerdata[0]);
        setTurn(1);
        setFuncId(funcId + 1);
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
                        <button onClick={nextFunc}>Passer à la suite</button>
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
                <h1>backlog estimé</h1>
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