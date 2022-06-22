import {IFilterControl} from "../interfaces/filter-control";
import {IFilterManager} from "../interfaces/filter-manager";
import {TFilterHandler} from "../interfaces/filter-handler";
import {IFilterControlOptions, TData} from "../interfaces/filter-control-options";

export class FilterControl<TValue = any, TResult extends TData = TData<TValue>> implements IFilterControl<TValue, TResult> {
    readonly id: string;
    readonly container: IFilterManager;
    readonly options: IFilterControlOptions<TValue, TResult>;
    private _value: TValue;

    get value(): TValue {
        return this._value;
    }

    get defaultValue(): TValue {
        const {value, data: dataOrParser} = this.options;
        if (value !== undefined) {
            return value;
        }

        let data = (dataOrParser instanceof Function) ? dataOrParser({control: this, manager: this.container}) : dataOrParser;

        return data.value;
    }

    constructor(options: IFilterControlOptions<TValue, TResult>, container: IFilterManager) {
        this.id = options.id;
        this.options = Object.freeze(options);
        this.container = container;
        this.next(this.options.value, true);
    }

    dispose(): void {
        this.container.remove(this);
    }

    reset(silently: boolean = false): void {
        this.next(this.defaultValue, silently);
    }

    next(value?: TValue, silently: boolean = false): void {
        if (value !== undefined) {
            this._value = value;
        }

        if (!silently) {
            this.container.publish<TResult>(this.id, this.data());
        }
    }

    data(): TResult {
        const {data} = this.options;
        if(data instanceof Function){
            return data({control: this, manager: this.container});
        }

        return {...data, value: this.value};
    }

    subscribe(handler: TFilterHandler): () => void {
        return this.container.subscribe<TValue, TResult>(handler, this.id, this);
    }
}
