import { doThenDispatch, FetchError, FetchSuccess, reloadThenDispatch, STATUS } from './utils';
import { Action, Dispatch } from 'redux';

export interface ActionTypes {
    STARTING: string;
    RELOADING: string;
    FINISHED: string;
    FAILED: string;
    INITIALIZE: string;
}

export interface RestReducer<T> {
    status: STATUS
}

export interface RestOk<T> extends RestReducer<T> {
    status: STATUS.OK;
    data: T;
}

export interface RestNotStarted<T> extends RestReducer<T> {
    status: STATUS.NOT_STARTED;
}

export interface RestLoading<T> extends RestReducer<T> {
    status: STATUS.LOADING;
}

export interface RestReloading<T> extends RestReducer<T> {
    status: STATUS.RELOADING;
    data: T;
}

export interface RestError<T> extends RestReducer<T> {
    status: STATUS.ERROR;
    error: string;
}


function getActionTypes(reducerNavn: string): ActionTypes {
    const navnUppercase = reducerNavn.toUpperCase() + ' / ';
    return {
        STARTING: navnUppercase + 'STARTING',
        RELOADING: navnUppercase + 'RELOADING',
        FINISHED: navnUppercase + 'FINISHED',
        FAILED: navnUppercase + 'FAILED',
        INITIALIZE: navnUppercase + 'INITIALIZE'
    };
}

export function createActionsAndReducer<T>(reducerNavn: string) {
    const actionTypes = getActionTypes(reducerNavn);

    const actionFunction = (fn: () => Promise<T>) => doThenDispatch(fn, actionTypes);
    const reload = (fn: () => Promise<T>) => reloadThenDispatch(fn, actionTypes);

    const tilbakestillReducer = (dispatch: Dispatch<Action>) => { dispatch({type: actionTypes.INITIALIZE}); };

    const initialState : RestReducer<T> = {
        status: STATUS.NOT_STARTED
    };
    return {
        action: actionFunction,
        reload,
        tilbakestillReducer: tilbakestillReducer,
        reducer: (state : RestReducer<T> = initialState, action: Action) : RestReducer<T> => {
            switch (action.type) {
                case actionTypes.STARTING:
                    return {
                        status: STATUS.LOADING
                    };
                case actionTypes.RELOADING:
                    if(state.status === STATUS.OK || state.status === STATUS.RELOADING) {
                        return {
                            ...state,
                            status: STATUS.RELOADING
                        };
                    }else {
                        return {
                            status: STATUS.LOADING
                        };
                    }
                case actionTypes.FINISHED:
                    return {
                        status: STATUS.OK,
                        data: (<FetchSuccess<T>> action).data
                    } as RestReducer<T> ;
                case actionTypes.FAILED:
                    return {
                        status: STATUS.ERROR,
                        error: (<FetchError> action).error
                    } as RestReducer<T> ;
                case actionTypes.INITIALIZE:
                    return initialState;
                default:
                    return state;
            }
        },
        actionNames: actionTypes
    };
}