import { PeriodeValg, UtbetalingerState } from './types';
import { actionKeys, Actions } from './actions';

const enManedSiden = new Date(Date.now());
enManedSiden.setMonth(enManedSiden.getMonth() - 1);

const initialState: UtbetalingerState = {
    ytelseIFokus: null,
    ekspanderteYtelser: [],
    filter: {
        periode: {
            radioValg: PeriodeValg.SISTE_30_DAGER,
            egendefinertPeriode: {
                fra: enManedSiden,
                til: new Date(Date.now())
            }
        },
        utbetaltTil: [],
        ytelser: []
    }
};

export function utbetalingerReducer(state: UtbetalingerState = initialState, action: Actions): UtbetalingerState {
    switch (action.type) {
        case actionKeys.SettYtelseIFokus:
            return {
                ...state,
                ytelseIFokus: action.ytelse
            };
        case actionKeys.SetEkspanderYtelse:
            if (action.ekspander) {
                return {
                    ...state,
                    ekspanderteYtelser: [...state.ekspanderteYtelser, action.ytelse]
                };
            } else {
                return {
                    ...state,
                    ekspanderteYtelser: state.ekspanderteYtelser.filter(y => y !== action.ytelse)
                };
            }
        case actionKeys.OppdaterFilter:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...action.change
                }
            };
        default:
            return state;
    }
}
