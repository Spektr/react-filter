import {IFilterManager} from "../interfaces/filter-manager";
import {IFilterControl} from "../interfaces/filter-control";
import {FilterControl} from "./filter-control";
import {FilterCompound} from "./filter-compound";
import {TFilterHandler} from "../interfaces/filter-handler";
import {IFilterControlOptions, TData} from "../interfaces/filter-control-options";
import {IFilterCompoundOptions} from "../interfaces/filter-compound-options";

export interface ITopic {
    handler: TFilterHandler;
    event?: string;
}

export class FilterManager implements IFilterManager {
    private controls = new Map<string, IFilterControl>();
    private handlers: ITopic[] = [];

    getComposition<TValue extends TData[], TResult extends TData<TValue>>(options: IFilterCompoundOptions<TValue, TResult>): IFilterControl<TValue, TResult> {
        let composition = this.controls.get(options.id) as IFilterControl<TValue, TResult> | null;

        if (!composition) {
            composition = new FilterCompound<TValue, TResult>(options, this);
            this.append(composition);
        }

        return composition;
    }

    create<TValue, TResult extends TData>(options: IFilterControlOptions<TValue, TResult>): IFilterControl<TValue, TResult> {
        let control = this.controls.get(options.id) as IFilterControl<TValue, TResult> || null;

        if (!control) {
            control = new FilterControl<TValue, TResult>(options, this);
            this.append(control);
        }

        return control;
    }

    append(control: IFilterControl<any>): this {
        const id = control.id;

        if (!this.controls.has(id)) {
            this.controls.set(id, control);
        }

        return this;
    }

    remove(control: IFilterControl<any>): this {
        // prevent cycling when code try to delete somewhere stored control
        if(Array.from(this.controls.values()).find((item)=>(item===control))){
            this.controls.delete(control.id);
        }


        return this;
    }

    hasControl(id: string): boolean {
        return this.controls.has(id);
    }

    getControl<TValue, TResult>(id: string): IFilterControl<TValue, TResult> | null {
        return this.controls.get(id) as IFilterControl<TValue, TResult> || null;
    }

    publish<TResult>(event: string, data: TResult): void {
        this.handlers.forEach((topic) => {
            if (!topic.event || topic.event === event) {
                topic.handler(event, data);
            }
        })
    }

    subscribe<TValue, TResult>(handler: TFilterHandler, event?: string, context?: IFilterControl<TValue, TResult>): () => void {
        const topic: ITopic = {event: event, handler: handler.bind(context || handler)};
        this.handlers.push(topic);

        return () => {
            this.handlers.splice(this.handlers.indexOf(topic), 1);
        };
    }
}

export const filterContainer = new FilterManager();
