export const rules = { STRICT: "strict", ABSMAJ: "absmaj" };

const CAFE = -1;

const unanimite = (votes) =>
  votes.every((v) => v === votes[0]) ? votes[0] : -1;

const RULES = {
  [rules.STRICT]: unanimite,
  [rules.ABSMAJ]: (votes) => {
    const cafes = votes.filter((v) => v === CAFE).length;
    if (cafes > votes.length / 2) return -1;
    const nums = votes.filter((v) => v !== CAFE);
    for (const v of new Set(nums)) {
      if (nums.filter((x) => x === v).length > nums.length / 2) return v;
    }
    return -1;
  },
};

export default function validate(votes, rule, turn) {
  if (votes.length === 0) return -1;
  const apply = turn === 1 ? RULES[rules.STRICT] : RULES[rule];
  return apply(votes);
}
