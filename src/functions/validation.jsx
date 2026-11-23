/** Les règles de vote disponibles. */
export const rules = { STRICT: "strict", ABSMAJ: "absmaj" };


const CAFE = -1;

/** 
 * Règle d'unanimité : tous les votes doivent être le même.
 * Décision de la table : égalité parfaite requise, sinon revote.
 * @param {number[]} votes - Les votes choisis.
 * @returns {number} Le même vote (nombre), ou -1 (carte café ou revote) si pas d'unanimité 
 */
export const unanimite = (votes) =>
  votes.every((v) => v === votes[0]) ? votes[0] : -1;

/**
 * Règle de majorité absolue : validée si une valeur réunit plus de la moitié des votes (carte café excluse).
 * Décision de la table : si la carte café dépasse la moitié ou il y a pas majorité absolue, revote.
 * @param {number[]} votes - Les votes choisis.
 * @returns {number} Le vote majoritaire , ou -1 si aucun n'atteint la majorité.
 */
export const absMaj = (votes) => {
  const cafes = votes.filter((v) => v === CAFE).length;
  if (cafes > votes.length / 2) return -1;
  const nums = votes.filter((v) => v !== CAFE);
  for (const v of new Set(nums)) {
    if (nums.filter((x) => x === v).length > nums.length / 2) return v;
  }
  return -1;
};

const RULES = {
  [rules.STRICT]: unanimite,
  [rules.ABSMAJ]: absMaj,
};


/**
 * Validité selon la règle et le tour.
 * Au premier tour, la règle d'unanimité s'applique toujours mais aux tours suivants, on doit choisir la règle.
 * @param {number[]} votes - Les votes choisis.
 * @param {string} rule - La règle à appliquer.
 * @param {number} turn - Le numéro du tour.
 * @returns {number} Le vote, ou -1 si ne correspond pas à la règle.
 */
export default function validate(votes, rule, turn) {
  if (votes.length === 0) return -1;
  const apply = turn === 1 ? RULES[rules.STRICT] : RULES[rule];
  return apply(votes);
}
