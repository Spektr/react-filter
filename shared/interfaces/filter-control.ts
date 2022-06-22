import {TFilterHandler} from "./filter-handler";

export interface IFilterControl<TValue = any, TData = any> {
    readonly id: string;
    readonly value: TValue;

    data(): TData;

    dispose(): void;

    reset(silently?: boolean): void;

    next(value?: TValue, silently?: boolean): void;

    subscribe(handler: TFilterHandler<TData>, event?: string, context?: IFilterControl): () => void;
}
