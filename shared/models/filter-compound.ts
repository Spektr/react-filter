import {IFilterControl} from "../interfaces/filter-control";
import {IFilterManager} from "../interfaces/filter-manager";
import {TFilterHandler} from "../interfaces/filter-handler";
import {IFilterControlOptions, TData} from "../interfaces/filter-control-options";
import {IFilterCompoundOptions} from "../interfaces/filter-compound-options";

export class FilterCompound<TValue extends TData[], TResult extends TData<TValue>> implements IFilterControl<TValue, TResult> {
    private subscriptions: Array<() => void>;
    private children: string[];
    readonly id: string;
    readonly partial: boolean;
    readonly container: IFilterManager;
    readonly options: IFilterControlOptions<TValue, TResult>;

    get value() {
        if(!this.canBePublished()){
            return this.options.value;
        }

        const result = this.children.reduce((acc, name) => {
            const filter = this.container.getControl(name);

            if (filter) {
                acc = acc.concat(filter.data());
            }
            return acc;
        }, []);

        return result as unknown as TValue;
    }

    constructor(options: IFilterCompoundOptions<TValue, TResult>, container: IFilterManager) {
        const {id, children, partial = false} = options;

        this.id = id;
        this.children = children.concat();
        this.partial = partial;
        this.container = container;
        this.options = Object.freeze(options);

        const notifyChanges = () => this.next();
        this.subscriptions = this.children.map((name) => this.container.subscribe(notifyChanges, name));
    }

    dispose(): void {
        this.subscriptions.forEach((subscription) => subscription());
        this.container.remove(this);
    }

    reset(silently: boolean = false): void {
        this.children.forEach((name) => {
            const filter = this.container.getControl(name);

            if (filter) {
                filter.reset(true);
            }
        });
        this.next();
    }

    next(): void {
        if (!this.canBePublished()) {
            return;
        }
        this.container.publish(this.id, this.data());
    }

    data(): TResult {
        const {data} = this.options;
        if (data instanceof Function) {
            return data({control: this, manager: this.container});
        }

        return {...data, value: this.value};
    }

    subscribe(handler: TFilterHandler): () => void {
        return this.container.subscribe(handler, this.id, this);
    }

    private canBePublished(): boolean {
        if(this.partial){
            return true;
        }

        const availableControlCount = this.children.reduce((acc, child)=>{
            return acc + (this.container.hasControl(child) ? 1: 0);
        }, 0);

        return this.children.length === availableControlCount;
    }
}
