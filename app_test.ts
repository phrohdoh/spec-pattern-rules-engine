import { assert } from './deps.ts';

import {
    PriceSpec,
    AlertCriteria,
    CriteriaOp,
    AlertEvalMsg,
} from './app.ts';

const _getAssertMsg = (
    { target }: AlertCriteria,
    { op, currPrice, prevPrice }: AlertEvalMsg,
) => {
    return `op=${op} prevPrice=${prevPrice} target=${target} currPrice=${currPrice}`;
};

type PriceSpecTestScenario = {
    op: CriteriaOp,
    prevPrice: AlertEvalMsg['prevPrice'],
    target: AlertCriteria['target'],
    currPrice: AlertEvalMsg['currPrice'],
};

const testPriceSpec = (
    testName: string,
    scenarios: PriceSpecTestScenario | Array<PriceSpecTestScenario>,
) => {
    const test = (scenario: PriceSpecTestScenario) => Deno.test(testName, () => {
        const { op, target, currPrice, prevPrice } = scenario;

        // arrange
        const criteria: AlertCriteria = { target };
        const spec = new PriceSpec(criteria);
        const candidate: AlertEvalMsg = { op, prevPrice, currPrice };

        // act
        const result = spec.isSatisfiedBy(candidate);

        // assert
        assert(result === true, _getAssertMsg(criteria, candidate));
    });

    if (Array.isArray(scenarios)) {
        for (const scenario of scenarios) {
            test(scenario);
        }
    } else {
        test(scenarios);
    }
};

testPriceSpec('PriceSpec is satisfied by CriteriaOp.GreaterThan iff prevPrice <= target <= currPrice', [
    {
        op: CriteriaOp.GreaterThan,
        prevPrice: 14.99,
        target: 15.00,
        currPrice: 15.01,
    },
    {
        op: CriteriaOp.GreaterThan,
        prevPrice: 15.00,
        target: 15.00,
        currPrice: 15.01,
    },
]);

testPriceSpec('PriceSpec is satisfied by CriteriaOp.GreaterThanOrEqualTo iff prevPrice < target <= currPrice', [
    {
        op: CriteriaOp.GreaterThanOrEqualTo,
        prevPrice: 14.99,
        target: 15.00,
        currPrice: 15.01,
    },
    {
        op: CriteriaOp.GreaterThanOrEqualTo,
        prevPrice: 14.99,
        target: 15.00,
        currPrice: 15.00,
    },
]);

testPriceSpec('PriceSpec is satisfied by CriteriaOp.Equals iff prevPrice !== target === currPrice', {
    op: CriteriaOp.Equals,
    prevPrice: 14.99,
    target: 15.00,
    currPrice: 15.00,
});

testPriceSpec('PriceSpec is satisfied by CriteriaOp.LessThanOrEqualTo iff prevPrice > target >= currPrice', [
    {
        op: CriteriaOp.LessThanOrEqualTo,
        prevPrice: 15.01,
        target: 15.00,
        currPrice: 14.99,
    },
    {
        op: CriteriaOp.LessThanOrEqualTo,
        prevPrice: 15.01,
        target: 15.00,
        currPrice: 15.00,
    },
]);

testPriceSpec('PriceSpec is satisfied by CriteriaOp.LessThan iff prevPrice > target > currPrice', {
    op: CriteriaOp.LessThan,
    prevPrice: 15.01,
    target: 15.00,
    currPrice: 14.99,
});
