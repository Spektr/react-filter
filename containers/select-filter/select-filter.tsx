import React, { useCallback, useEffect, useState } from "react";
import { useFilterControl } from "../../shared/utils/filter-hooks";
import { TData, IFilterControlOptions } from "../../shared/interfaces/filter-control-options";
import { Omit } from "@material-ui/pickers/_helpers/utils";
import { Select, SelectProps } from "@material-ui/core";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { getFilter, setFilterAction } from "../../../../modules/filter";
import { FilterName } from "../../../../modules/filter/shared/enums/filter-name";

type TProps<T extends TData> = {
    options: IFilterControlOptions<unknown, T>;
} & Omit<SelectProps, 'onChange' | 'value'>;

export function SelectFilter<T extends TData<unknown>>(props: TProps<T>): JSX.Element {
    const {options, ...other} = props;
    const {control} = useFilterControl<unknown, T>(options);
    const [innerValue, setInnerValue] = useState<unknown>(control.value);

    const onChangeHandler = useCallback((event) => {
        const value = event.target.value;
        setInnerValue(value)
        control.next(value);
    }, [control]);

    // update duplicates
    useEffect(() => {
        return control.subscribe(() => {
            if (control.value !== innerValue) {
                setInnerValue(control.value);
            }
        });
    }, [control, innerValue]);

    return (
        <Select
            {...other}
            value={innerValue}
            onChange={onChangeHandler}
        />
    );
}
