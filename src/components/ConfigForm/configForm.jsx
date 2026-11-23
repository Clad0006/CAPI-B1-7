import React from "react";
import { useLocation } from 'wouter';

function ConfigForm() {
    function validateJSONbacklog(data) {
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
    function validateJSONstate(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return false;
        }

        if (typeof data.fonctionnalite_courrante !== 'number' || typeof data.regle !== 'string') {
            return false;
        }

        if (!validateJSONbacklog(data.backlog)) {
            return false;
        }

        if (!Array.isArray(data.joueurs)) {
            return false;
        }

        return data.joueurs.every(j => {
            return (typeof j === 'string' && true && !Array.isArray(j));
        });
    }
    const [, navigate] = useLocation();
    const [erreur, setErreur] = React.useState(null);
    const [nbJoueurs, setNbJoueurs] = React.useState(2);
    const [messagebacklog, setMessageBacklog] = React.useState(null);
    const [messagestate, setMessageState] = React.useState(null);
    async function handleBacklogSubmit(event){
        event.preventDefault();
        sessionStorage.clear();
        const formData = new FormData(event.target);
        const pseudos = Array.from({ length: nbJoueurs }, (_, i) =>
            formData.get(`pseudo-${i}`).trim()
        );

        if (pseudos.includes("")) {
            setMessageBacklog("Tous les pseudos doivent être renseignés");
            return;
        } else if (new Set(pseudos).size !== pseudos.length) {
            setMessageBacklog("Les pseudos doivent être uniques");
            return;
        } else {
            sessionStorage.setItem("playersData", JSON.stringify(pseudos));
        }
        const regle = formData.get('regle');
        if (regle !== "strict" && regle !== "absmaj") {
            setMessageBacklog("Règle invalide");
            return;
        } else {
            sessionStorage.setItem("regle", regle);
        }
        const file = formData.get('backlog');
        if (!file || file.size === 0) return;
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            if (!validateJSONbacklog(jsonData)) {
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
    async function handleStateSubmit(event){
        event.preventDefault();
        sessionStorage.clear();
        const formData = new FormData(event.target);
        const file = formData.get('state');
        if (!file || file.size === 0) return;
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            if (!validateJSONstate(jsonData)) {
                alert("Format JSON invalide !");
                return;
            }
            sessionStorage.setItem('backlogData', JSON.stringify(jsonData.backlog));
            const pseudos = jsonData.joueurs;
            if (pseudos.includes("")) {
                setMessageState("Pseudos vides dans la sauvegarde");
                return;
            } else if (new Set(pseudos).size !== pseudos.length) {
                setMessageState("Pseudos dupliqués dans la sauvegarde");
                return;
            } else {
                sessionStorage.setItem("playersData", JSON.stringify(pseudos));
            }
            const regle = jsonData.regle;
            if (regle !== "strict" && regle !== "absmaj") {
                setMessageState("Règle invalide dans la sauvegarde");
                return;
            } else {
                sessionStorage.setItem("regle", regle);
            }
            const currFeat = jsonData.fonctionnalite_courrante;
            if (currFeat < 0 || currFeat >= jsonData.backlog.fonctionnalites.length) {
                setMessageState("Fonctionnalité courante invalide dans la sauvegarde");
                return;
            } else {
                sessionStorage.setItem("currentFeature", currFeat);
            }
            navigate('/poker');
        } catch (error) {
            console.error(error);
            setErreur("Erreur lors de l'importation de la sauvegarde : impossible de lire le fichier");
        }
    }
    return (
        <div>
            <h2>Créer une nouvelle partie</h2>
            <form onSubmit={handleBacklogSubmit}>
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
                <label htmlFor="regle">Règle de vote </label>
                <select id="regle" name="regle" defaultValue="STRICT">
                    <option value="STRICT">Unanimité</option>
                    <option value="ABSMAJ">Majorité absolue</option>
                </select>
                <br/>
                <label htmlFor="backlog">Importer le backlog </label>
                <input type="file" name="backlog" id={"file"}  required/>
                <div>
                    <button type="submit">Valider</button>
                </div>
            </form>
            <p>{messagebacklog}</p>
            <p className={"error"}>{erreur}</p>
            <h2>Charger une sauvegarde</h2>
            <form onSubmit={handleStateSubmit}>
                <label htmlFor="state">Importer le fichier de sauvegarde</label>
                <input type="file" name="state" id={"file"}  required/>
                <div>
                    <button type="submit">Valider</button>
                </div>
            </form>
            <p>{messagestate}</p>
            <p className={"error"}>{erreur}</p>
        </div>
    );
}

export default ConfigForm;