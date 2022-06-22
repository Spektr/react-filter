import {IFilterControl} from "./filter-control";
import {IFilterManager} from "./filter-manager";

export type TData<T = any> = Record<string, any> & { value: T };
export type TDataValue<T> = T extends TData<infer TValue> ? TValue : never;
export type TDataParser<TValue, TData> = (api: { control: IFilterControl<TValue, TData>, manager: IFilterManager }) => TData;

export interface IFilterControlOptions<TValue, TData> {
    id: string;
    value: TValue;
    data: TData | TDataParser<TValue, TData>;
    persistent?: boolean;

    // TODO: add option to store field value
}
