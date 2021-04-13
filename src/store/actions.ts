import { ActionTree, ActionContext } from 'vuex';
import {Mutations} from '@/store/mutations';
import {State} from '@/store/state';
import {ActionType} from '@/store/types';

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>,
} & Omit<ActionContext<State, State>, 'commit'>;

export interface Actions {
    [ActionType.GET](
        { commit }: AugmentedActionContext,
    ): Promise<any>;
}

export const actions: ActionTree<State, State> & Actions = {
    GET({commit}: AugmentedActionContext): Promise<any> {
        return Promise.resolve(undefined);
    },
};
