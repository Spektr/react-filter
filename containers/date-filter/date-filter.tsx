import React, {useCallback, useEffect, useState} from "react";
import {useFilterControl} from "../../shared/utils/filter-hooks";
import {TData, IFilterControlOptions, TDataValue} from "../../shared/interfaces/filter-control-options";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {KeyboardDatePickerProps} from "@material-ui/pickers/DatePicker/DatePicker";
import {Omit} from "@material-ui/pickers/_helpers/utils";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";


type TProps<T extends TData> = {
    options: IFilterControlOptions<Date | null, T>;
} & Omit<KeyboardDatePickerProps, 'onChange' | 'value'>;

export function DateFilter<T extends TData<number | null>>(props: TProps<T>): JSX.Element {
    const {options, ...other} = props;
    const {value = null, data} = options;
    const {control} = useFilterControl<Date | null, T>({
        ...options,
        data: (data instanceof Function)
            ? data
            : ({control}) => {
                return ({...data, value: control.value === null ? null : control.value.getTime()});
            },
    });
    const [innerValue, setInnerValue] = useState<Date | null>(value);

    const onChangeHandler = useCallback((date: MaterialUiPickersDate | null, value?: string | null) => {
        if(date instanceof Date && isNaN(date.getTime())){
            return;
        }

        setInnerValue(date)
        control.next(date);
    }, [control]);

    // update duplicates
    useEffect(()=>{
        return control.subscribe(()=>{
            if(control.value !== innerValue){
                setInnerValue(control.value);
            }
        });
    }, [control, innerValue]);

    return (<KeyboardDatePicker
        {...other}
        value={innerValue}
        onChange={onChangeHandler}
    />)
}
