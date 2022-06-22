import {IFilterManager} from "../interfaces/filter-manager";
import {IFilterControl} from "../interfaces/filter-control";
import {useContext, useEffect, useMemo, useState} from "react";
import {FilterContext} from "../../containers/filter-provider/filter-provider";
import {IFilterControlOptions, TData} from "../interfaces/filter-control-options";
import {IFilterCompoundOptions} from "../interfaces/filter-compound-options";

interface IFilterHookResult<T> {
    control: T,
    filter: T extends IFilterControl<any, infer U> ? U : never,
    manager: IFilterManager,
}

/**
 *
 * @param options {IFilterCompoundOptions} - options
 * @param options.id {string} - filter's id
 * @param options.value {TData[]} - combined children data
 * @param options.children {string[]}  - ids of tracked filters
 * @param options.data {TData | TDataParser<TValue, TData>}  - filter's payload (can be instance of TData or lambda)
 * @param options.partial {boolean | undefined}  - is filter wait all children before emit data
 * @param options.persistent {boolean | undefined}  - don't remove filter control after removing view
 * @return {IFilterHookResult<IFilterControl>} - filter data and objects
 * @example
 * const {filter, component, manager} = useFilter({
 *    id: 'filter-id',
 *    value:[],
 *    children: ['name', 'age'],
 *    data: ({control, manager})=>({value: control.value, payload: (manager.hasControl('test') ? true : false) })
 *    partial: true,
 * });
 * assert(filter).sameAs({
 *   payload: false,
 *   value: [
 *     {value: 'Vasia', name: 'name'},
 *     {value: 30, name: 'age'},
 *   ],
 * });
 */
export function useFilter<TValue extends TData[], TResult extends TData<TValue>>(options: IFilterCompoundOptions<TValue, TResult>): IFilterHookResult<IFilterControl<TValue, TResult>> {
    const manager = useContext(FilterContext);

    const control = manager.getComposition<TValue, TResult>(options);

    // set default value !NOT first (first value will be set after async rendering in useEffect)
    const [filter, setFilter] = useState<TResult>(control.data());

    useEffect(() => {

        // set first value
        setFilter(control.data());

        // subscribe on later changes
        const onChangeSubscription = control.subscribe(<T>(_, data) => setFilter(data));
        return () => {
            onChangeSubscription();
            if(!options.persistent){
                control.dispose();
            }
        }
    }, [control]);

    return {filter, control, manager};
}

/**
 *
 * @param {IFilterControlOptions} options - filter options
 * @param options.id {string} - filter's id
 * @param options.value {TData[]} - combined children data
 * @param options.data {TData | TDataParser<TValue, TData>}  - filter's payload (can be instance of TData or lambda)
 * @param options.persistent {boolean | undefined}  - don't remove filter control after removing view
 * @return {IFilterHookResult<IFilterControl>} - filter data and objects
 * @example
 * const {filter, component, manager} = useFilterControl<Date, {value: number, field:string}>({
 *    id: 'filter-id',
 *    value: new Date(),
 *    data: ({control, manager})=>({value: control.value.getTime(), field: 'createdAt'})
 * });
 * assert(filter).sameAs({
 *   field: 'createdAt',
 *   value: 1652445278255,
 * });
 */
export function useFilterControl<TValue, TResult extends TData>(options: IFilterControlOptions<TValue, TResult>): IFilterHookResult<IFilterControl<TValue, TResult>> {
    const manager = useContext(FilterContext);

    // manager under hood use id for memoization
    const control = manager.create<TValue, TResult>(options);

    // set default value !NOT first (first value will be set after async rendering in useEffect)
    const [filter, setFilter] = useState<TResult>(control.data());

    useEffect(() => {

        // set first value
        setFilter(control.data());

        // subscribe on later changes
        const onChangeSubscription = control.subscribe((_, data) => setFilter(data));

        return () => {
            onChangeSubscription();
            if(!options.persistent){
                control.dispose();
            }
        };
    }, [control]);

    return {filter, control, manager};
}
