import React from "react";
import { useLocation } from 'wouter';

function ConfigForm() {
    function validateJSON(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return false;
        }

        if (typeof data.projet !== 'string') {
            return false;
        }

        if (!Array.isArray(data.fonctionnalites)) {
            return false;
        }

        return data.fonctionnalites.every(f => {
            return (
                typeof f === 'object' &&
                f !== null &&
                !Array.isArray(f) &&
                typeof f.id === 'string' &&
                typeof f.titre === 'string' &&
                typeof f.estimation === 'number'
            );
        });
    }
    const [, navigate] = useLocation();
    const [erreur, setErreur] = React.useState(null);
    const [nbJoueurs, setNbJoueurs] = React.useState(2);
    const [message, setMessage] = React.useState(null);
    async function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const pseudos = Array.from({ length: nbJoueurs }, (_, i) =>
            formData.get(`pseudo-${i}`).trim()
        );

        if (pseudos.includes("")) {
            setMessage("Tous les pseudos doivent être renseignés");
            return;
        } else if (new Set(pseudos).size !== pseudos.length) {
            setMessage("Les pseudos doivent être uniques");
            return;
        } else {
            sessionStorage.setItem("playersData", JSON.stringify(pseudos));
        }
        const file = formData.get('backlog');
        if (!file || file.size === 0) return;
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            if (!validateJSON(jsonData)) {
                alert("Format JSON invalide !");
                return;
            }
            sessionStorage.setItem('backlogData', JSON.stringify(jsonData));
            navigate('/poker');
        } catch (error) {
            console.error(error);
            setErreur("Erreur lors de l'importation du backlog : impossible de lire le fichier");
        }
    }
    return (
        <div>
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
                <label htmlFor="backlog">Importer le backlog </label>
                <input type="file" name="backlog" id={"file"}  required/>
                <div>
                    <button type="submit">Valider</button>
                </div>
            </form>
            <p>{message}</p>
            <p className={"error"}>{erreur}</p>
        </div>
    );
}

export default ConfigForm;