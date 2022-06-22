import {createContext, PropsWithChildren} from "react";
import {IFilterManager} from "../../shared/interfaces/filter-manager";
import {filterContainer} from "../../shared/models/filter-manager";

export const FilterContext = createContext<IFilterManager>(filterContainer);

export const FilterProvider = (props: PropsWithChildren<{ value?: IFilterManager }>): JSX.Element => {
    const {value = filterContainer, children} = props;
    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

