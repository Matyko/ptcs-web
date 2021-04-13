import { MutationTree } from 'vuex';
import {MutationType, StateType} from './types';
import { State } from './state';
import {User} from '@/types';

export interface Mutations<S = State> {
    [MutationType.SET_USER](state: S, payload: User | null): void;
    [MutationType.SET_LOGGED_IN](state: S, payload: boolean): void;
    [MutationType.SET_AUTH_READY](state: S, payload: boolean): void;
}

export const mutations: MutationTree<State> & Mutations = {
    SET_AUTH_READY(state: State, payload: boolean) {
        state[StateType.AUTH_READY] = payload;
    },
    [MutationType.SET_USER](state, payload: User | null) {
        state[StateType.USER] = payload;
    },
    [MutationType.SET_LOGGED_IN](state, payload: boolean) {
        state[StateType.LOGGED_IN] = payload;
    },
};
