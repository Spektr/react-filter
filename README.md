# Basic elements

There are three basic elements of filtering:

- control - entity that store valuable value and allows to do some actions
- composition - bunch of controls
- manager - container for controls and compositions

## Create control manually

```ts
/**
 * TValue - type of working value
 * TResult - type of resulted value
 * options -
 */
type TValue = number;
type TResult = { value: string };
const options = {
    id: 'test',
    value: 5,
    data: ({control}) => ({value: control.value.toString()})
};

const manager = new FilterManager();
const control = manager.create<TValue, TResult>(options);

const unsubscribe = control.subscribe((_, data) => {
    console.log(data);
    unsubscribe();
});
```

## Create composition manually

Also, we can combine several controls into one composition

```ts
const control = manager.getComposition<TValue, TResult>({
    id: 'compound',
    value: [],
    children: ['test', 'test2'],
    data: {value: []}
});

const unsubscribe = control.subscribe((_, data) => {
    console.log(data);
    unsubscribe();
});
```

## React hooks

For react we can use hooks, there are hooks for get control, get composition, get pagination controls

```tsx
import {useFilterControl} from "./filter-hooks";

const {filter, control, manager} = useFilterControl<number, { value: string; name: string }>({
    id: 'test',
    value: 5,
    data: ({control}) => ({
        value: control.value.toString(),
        name: 'test',
    })
})


const {filter: compoundFilter} = useFilter<{ value: string; name: string }[], { value: Array<{ value: any }> }>({
    id: 'compound-filter',
    value: [],
    children: ['test', 'test2'],
    data: {name: 'compound-filter', value: []},
    partial: true,
});

console.log(filter, compoundFilter);
```
