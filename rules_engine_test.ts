import { assert } from './deps.ts';
import * as rulesEngine from './rules_engine.ts';

type FakeCandidate = {};  // type
const FakeCandidate = {}; // value

export class TrueSpec<FakeCandidate> implements rulesEngine.ISpec<FakeCandidate> {
    public isSatisfiedBy(_candidate: FakeCandidate): boolean {
        return true;
    }
}

export class FalseSpec<FakeCandidate> implements rulesEngine.ISpec<FakeCandidate> {
    public isSatisfiedBy(_candidate: FakeCandidate): boolean {
        return false;
    }
}

Deno.test('AndSpec is satisfied by N satisfied child specs, where 2 <= N <= 5', () => {
    // arrange
    const numChildren = Math.floor(Math.random() * 5 + 2);
    const spec = new rulesEngine.AndSpec<FakeCandidate>();

    for (let _ = 0; _ < numChildren; _++) {
        spec.addChildSpec(new TrueSpec());
    }

    spec.addChildSpec(new TrueSpec());
    spec.addChildSpec(new TrueSpec());

    // act
    const result = spec.isSatisfiedBy(FakeCandidate);

    // assert
    assert(result === true);
});
