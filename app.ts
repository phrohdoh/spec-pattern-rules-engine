#!/usr/bin/env deno

import * as rulesEngine from './rules_engine.ts';

export interface AlertEvalMsg {
    currPrice: number;
    prevPrice: number;
};

/** Alert the user when an asset's value satisfies criteria defined by said user */
export interface AlertCriteria {
    op: CriteriaOp;
    target: number;
};

export enum CriteriaOp {
    GreaterThan = 'GreaterThan',
    GreaterThanOrEqualTo = 'GreaterThanOrEqualTo',
    Equals = 'Equals',
    LessThanOrEqualTo = 'LessThanOrEqualTo',
    LessThan = 'LessThan',
}

export class PriceSpec implements rulesEngine.ISpec<AlertEvalMsg> {
    private readonly _alertCriteria: AlertCriteria;

    constructor(alertCriteria: AlertCriteria) {
        this._alertCriteria = alertCriteria;
    }

    isSatisfiedBy({ prevPrice, currPrice }: AlertEvalMsg): boolean {
        const { target, op } = this._alertCriteria;

        switch (op) {
            case CriteriaOp.GreaterThan:
                return prevPrice <=  target && target <   currPrice;
            case CriteriaOp.GreaterThanOrEqualTo:
                return prevPrice <   target && target <=  currPrice;
            case CriteriaOp.Equals:
                return prevPrice !== target && target === currPrice;
            case CriteriaOp.LessThanOrEqualTo:
                return prevPrice >   target && target >=  currPrice
            case CriteriaOp.LessThan:
                return prevPrice >   target && target >   currPrice;
            default:
                throw new Error(`PriceSpec.isSatisfiedBy op '${op}' not supported`);
        }
    }
}

if (import.meta.main) {
    console.error('ERROR: not yet ready to be executed directly');
    Deno.exit(1);
}
