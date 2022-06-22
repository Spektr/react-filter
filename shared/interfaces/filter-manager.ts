import {IFilterControl} from "./filter-control";
import {TFilterHandler} from "./filter-handler";
import {IFilterControlOptions, TData} from "./filter-control-options";
import {IFilterCompoundOptions} from "./filter-compound-options";

export interface IFilterManager {
    // storage methods
    getComposition<TValue extends TData[], TResult extends TData<TValue>>(options: IFilterCompoundOptions<TValue, TResult>): IFilterControl<TValue, TResult>;

    hasControl(id: string): boolean;

    getControl<TValue = any, TResult = any>(id: string): IFilterControl<TValue, TResult> | null;

    append(component: IFilterControl): this;

    remove(component: IFilterControl): this;

    create<TValue, TResult extends TData>(options: IFilterControlOptions<TValue, TResult>): IFilterControl<TValue, TResult>;

    // PubSub methods
    subscribe<TValue, TResult>(handler: TFilterHandler, event?: string, context?: IFilterControl<TValue, TResult>): () => void;

    publish<TResult>(event: string, data: TResult): void;
}
