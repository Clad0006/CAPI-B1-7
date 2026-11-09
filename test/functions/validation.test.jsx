import { expect, test } from "vitest";
import validate, { rules } from "../../src/functions/validation.jsx";

test('test_CA_01_1_strict_non_atteint', () => {
    let votes= [3,3,3,5];
    let rule = rules.STRICT;
    let turn = 1;

    expect(validate(votes,rule,turn)).toEqual(-1);
})

test('test_CA_01_2_strict_atteint', () => {
    let votes= [3,3,3,3];
    let rule = rules.STRICT;
    let turn = 1;

    expect(validate(votes,rule,turn)).toEqual(3);
})

test('test_CA_02_1_not_maj_turn_two', () => {
    let votes= [5,5,8,8];
    let rule = rules.ABSMAJ;
    let turn = 2;

    expect(validate(votes,rule,turn)).toEqual(-1);
})

test('test_CA_02_2_maj_turn_two', () => {
    let votes= [5,8,8,8];
    let rule = rules.ABSMAJ;
    let turn = 2;

    expect(validate(votes,rule,turn)).toEqual(8);
})

test('test_CA_03_1_not_unan_turn_one', () => {
    let votes= [5,5,8];
    let rule = rules.ABSMAJ;
    let turn = 1;

    expect(validate(votes,rule,turn)).toEqual(-1);
})

test('test_CA_03_2_unan_turn_one', () => {
    let votes= [5,5,5];
    let rule = rules.ABSMAJ;
    let turn = 1;

    expect(validate(votes,rule,turn)).toEqual(5);
})

test('test_CA_04_1_not_unan_coffee', () => {
    let votes= [-1,-1,-1,-1,-1,5,8,8];
    let rule = rules.ABSMAJ;
    let turn = 2;

    expect(validate(votes,rule,turn)).toEqual(-1);
})

test('test_CA_04_2_maj_with_coffee', () => {
    let votes= [-1,5,8,8];
    let rule = rules.ABSMAJ;
    let turn = 2;

    expect(validate(votes,rule,turn)).toEqual(8);
})