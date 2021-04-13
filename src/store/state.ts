import {StateType} from '@/store/types';
import {User} from '@/types';

export interface State {
    [StateType.USER]: User | null;
    [StateType.LOGGED_IN]: boolean;
    [StateType.AUTH_READY]: boolean;
}

export const state = {
    [StateType.USER]: null,
    [StateType.LOGGED_IN]: false,
    [StateType.AUTH_READY]: false,
};
