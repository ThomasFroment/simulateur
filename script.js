const [montantInput, tauxInput, anneeInput] = [document.getElementById("montant"), document.getElementById("taux"), document.getElementById("annee")];

class Simulateur {
    constructor() {
        this.echeances = [];
        this.simulateurGrid = document.getElementById("simulateur");
        this.values = {
            montant: 0,
            taux: 0,
            annee: 1,
        };
    }
    retreiveData() {
        montantInput.value = Math.max(montantInput.value, 0);
        tauxInput.value = Math.max(tauxInput.value, 0);
        anneeInput.value = Math.max(anneeInput.value, 1);

        this.values = {
            montant: montantInput.value,
            taux: tauxInput.value / 100,
            annee: anneeInput.value * 12,
        };
    }
    simulateurTaux() {
        this.retreiveData();

        const [montant, taux, duree] = [this.values.montant, this.values.taux, this.values.annee];
        const echeances = [];

        const mensualite = taux ? (montant * (taux / 12)) / (1 - Math.pow(1 + taux / 12, -duree)) : montant / duree;

        let prec = montant;
        for (let i = 0; i < duree; i++) {
            const capital_restant = prec * (1 + taux / 12) - mensualite;
            const interets = (prec * taux) / 12;
            const capital_amorti = mensualite - interets;

            const echeance = {
                periode: i + 1,
                mensualite: mensualite,
                capital_restant: capital_restant,
                interets: interets,
                capital_amorti: capital_amorti,
            };

            echeances.push(echeance);
            prec = capital_restant;
        }

        this.echeances = echeances;
        this.displayEcheances();
    }
    displayEcheances() {
        document.querySelectorAll(".simulateur-row").forEach((el) => {
            el.remove();
        });

        this.echeances.forEach((echeance) => {
            this.simulateurGrid.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="simulateur-row">
                        <span>${echeance.periode}</span>
                        <span>${Math.round(echeance.capital_amorti)}</span>
                        <span>${Math.round(echeance.interets)}</span>
                        <span>${Math.round(echeance.capital_restant)}</span>
                        <span>${Math.round(echeance.mensualite)}</span>
                    </div>
                `
            );
        });
    }
}

const simulateurInstance = new Simulateur();

document.getElementById("inputs").addEventListener("change", () => {
    simulateurInstance.simulateurTaux();
});
simulateurInstance.simulateurTaux();
