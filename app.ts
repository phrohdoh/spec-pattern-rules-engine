#!/usr/bin/env -S deno --allow-net

import { HttpServer } from "./deps.ts";
import * as rulesEngine from "./rules_engine.ts";

export interface AlertEvalMsg {
  currPrice: number;
  prevPrice: number;
}

/** Alert the user when an asset's value satisfies criteria defined by said user */
export interface AlertCriteria {
  op: CriteriaOp;
  target: number;
}

export enum CriteriaOp {
  GreaterThan = "GreaterThan",
  GreaterThanOrEqualTo = "GreaterThanOrEqualTo",
  Equals = "Equals",
  LessThanOrEqualTo = "LessThanOrEqualTo",
  LessThan = "LessThan"
}

export class PriceSpec implements rulesEngine.ISpec<AlertEvalMsg> {
  private readonly _alertCriteria: AlertCriteria;

  constructor(alertCriteria: AlertCriteria) {
    this._alertCriteria = alertCriteria;
  }

  public isSatisfiedBy({ prevPrice, currPrice }: AlertEvalMsg): boolean {
    const { target, op } = this._alertCriteria;

    console.log(`evaluating whether a price change from $${prevPrice} to $${currPrice} satisfies "now ${op} $${target}"`);

    switch (op) {
      case CriteriaOp.GreaterThan:
        return prevPrice <= target && target < currPrice;
      case CriteriaOp.GreaterThanOrEqualTo:
        return prevPrice < target && target <= currPrice;
      case CriteriaOp.Equals:
        return prevPrice !== target && target === currPrice;
      case CriteriaOp.LessThanOrEqualTo:
        return prevPrice > target && target >= currPrice;
      case CriteriaOp.LessThan:
        return prevPrice > target && target > currPrice;
      default:
        throw new Error(`PriceSpec.isSatisfiedBy op '${op}' not supported`);
    }
  }
}

const onNewPrice = async ({ params: { prevPrice, currPrice }}: any, spec: rulesEngine.ISpec<AlertEvalMsg>) => {
  const evalMsg: AlertEvalMsg = {
    currPrice: parseFloat(currPrice),
    prevPrice: parseFloat(prevPrice),
  };

  const satisfiesSpec = spec.isSatisfiedBy(evalMsg);
  return satisfiesSpec;
};

async function main() {
  const httpServerConfig = { port: 8080 };
  console.log('starting http server', httpServerConfig);

  const httpServer = new HttpServer();
  httpServer
    .get("/new-price/:prevPrice/:currPrice", (ctx: any) => {
      function randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex];
      }

      const spec /* pretend we get this from the db */ = new PriceSpec({
        op: randomEnum(CriteriaOp),
        target: (() => {
          const min = 10;
          const max = 30;
          return Math.floor(Math.random() * max + min);
        })(),
      });

      return onNewPrice(ctx, spec);
    })
    .start(httpServerConfig);
}

if (import.meta.main) {
  main();
}
