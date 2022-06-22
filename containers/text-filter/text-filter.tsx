import {useCallback, useEffect, useState} from "react";
import {useFilterControl} from "../../shared/utils/filter-hooks";
import {TextField, TextFieldProps} from "@material-ui/core";
import {TData, IFilterControlOptions, TDataValue} from "../../shared/interfaces/filter-control-options";
import { FilterName } from "../../../../modules/filter/shared/enums/filter-name";

type TProps<T extends TData> = {
    options: IFilterControlOptions<TDataValue<T>, T>;
    filterName: FilterName;
} & TextFieldProps;

export function TextFilter<T extends TData>(props: TProps<T>): JSX.Element {
    const {filterName, options, ...other} = props;
    const {control} = useFilterControl<TDataValue<T>, T>(options);
    const [innerValue, setInnerValue] = useState(control.value);

    const onChangeHandler = useCallback((e) => {
        const value = e.target.value;
        setInnerValue(value)
        control.next(value);
    }, [control]);

    // update duplicates
    useEffect(()=>{
        return control.subscribe(()=>{
            if(control.value !== innerValue){
                setInnerValue(control.value);
            }
        });
    }, [control, innerValue]);

    return (<TextField
        {...other}
        value={innerValue}
        onChange={onChangeHandler}
    />)
}
