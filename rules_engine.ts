export interface ISpec<TCandidate> {
    isSatisfiedBy(candidate: TCandidate): boolean;
}

export abstract class CompositeSpec<TCandidate> implements ISpec<TCandidate> {
    protected readonly _childSpecs: Array<ISpec<TCandidate>> = [];

    public readonly children: Readonly<CompositeSpec<TCandidate>['_childSpecs']> = this._childSpecs;
    public abstract isSatisfiedBy(candidate: TCandidate): boolean;

    public addChildSpec(newChildSpec: ISpec<TCandidate>): void {
        this._childSpecs.push(newChildSpec);
    }
}

export class AndSpec<TCandidate> extends CompositeSpec<TCandidate> {
    public isSatisfiedBy(candidate: TCandidate): boolean {
        if (this._childSpecs.length === 0) {
            return false;
        }

        for (const spec of this._childSpecs) {
            // if *any* are unsatisfied then the entire AND spec is unsatisfied
            if (!spec.isSatisfiedBy(candidate)) {
                return false;
            }
        }

        return true;
    }
}

export class OrSpec<TCandidate> extends CompositeSpec<TCandidate> {
    public isSatisfiedBy(candidate: TCandidate): boolean {
        if (this._childSpecs.length === 0) {
            return false;
        }

        for (const spec of this._childSpecs) {
            // if *any* are satisfied then the entire OR spec is satisfied
            if (spec.isSatisfiedBy(candidate)) {
                return true;
            }
        }

        return false;
    }
}
