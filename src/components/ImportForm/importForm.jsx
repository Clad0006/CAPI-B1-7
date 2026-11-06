import React from "react";
import { useLocation } from 'wouter';

function ImportForm() {
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
    async function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const file = formData.get('backlog');
        if (!file || file.size === 0) return;
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            if (!validateJSON(jsonData)) {
                alert("Format JSON invalide !");
                return;
            }
            sessionStorage.setItem('formData', JSON.stringify(jsonData));
            navigate('/poker');
        } catch (error) {
            console.error(error);
            setErreur("Erreur lors de l'importation du backlog : impossible de lire le fichier");
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="backlog">Importer le backlog </label>
                <input type="file" name="backlog" id={"file"}  required/>
                <button type="submit">Valider</button>
            </form>
            <p className={"error"}>{erreur}</p>
        </div>
    );
}

export default ImportForm;