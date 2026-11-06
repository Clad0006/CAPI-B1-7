import React from "react";
import { useLocation } from "wouter";

function PlayersForm() {
    const [, navigate] = useLocation();
    const [nbJoueurs, setNbJoueurs] = React.useState(2);
    const [message, setMessage] = React.useState(null);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const pseudos = Array.from({ length: nbJoueurs }, (_, i) =>
            formData.get(`pseudo-${i}`).trim()
        );

        if (pseudos.includes("")) {
            setMessage("Tous les pseudos doivent être renseignés");
        } else if (new Set(pseudos).size !== pseudos.length) {
            setMessage("Les pseudos doivent être uniques");
        } else {
            sessionStorage.setItem("players", JSON.stringify(pseudos));
            navigate("/backlog");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nbJoueurs">Nombre de joueurs </label>
            <input
                id="nbJoueurs"
                type="number"
                min="2"
                max="10"
                value={nbJoueurs}
                onChange={e => setNbJoueurs(Math.min(10, Math.max(2, Number(e.target.value))))}
            />

            {Array.from({ length: nbJoueurs }, (_, i) => (
                <div key={i}>
                    <label htmlFor={`pseudo-${i}`}>Pseudo du joueur {i + 1} </label>
                    <input id={`pseudo-${i}`} name={`pseudo-${i}`} type="text" />
                </div>
            ))}

            <button type="submit">Valider l'équipe</button>
            <p>{message}</p>
        </form>
    );
}

export default PlayersForm;