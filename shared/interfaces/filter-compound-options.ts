import {IFilterControlOptions} from "./filter-control-options";

export interface IFilterCompoundOptions<TValue, TData> extends IFilterControlOptions<TValue, TData> {
    children: string[];
    partial?: boolean;
}
