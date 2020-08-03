export interface VisOppfolgingFraTilDato {
    fra: Date;
    til: Date;
}

export interface OppfolgingState {
    valgtPeriode: VisOppfolgingFraTilDato;
    sykefraværEkspandert: boolean;
    ytelserEkspandert: boolean;
}

const lagDate = (manedFraNow: number) => {
    const date = new Date(Date.now());
    date.setMonth(date.getMonth() + manedFraNow);
    return date;
};

export const initialState: OppfolgingState = {
    valgtPeriode: { fra: lagDate(-2), til: lagDate(1) },
    sykefraværEkspandert: false,
    ytelserEkspandert: false
};

export enum OppfolgingActionTypes {
    SetValgtPeriode = 'SetValgtPeriode',
    SetSykefraværEkspandert = 'SetSykefraværEkspandert',
    SetYtelserEkspandert = 'SetYtelserEkspandert'
}

export interface SetValgtPeriode {
    type: OppfolgingActionTypes.SetValgtPeriode;
    periodeEndring: Partial<VisOppfolgingFraTilDato>;
}

export interface SetSykefraværEkspandertAction {
    type: OppfolgingActionTypes.SetSykefraværEkspandert;
    ekspandert: boolean;
}

export interface SetYtelserEkspandertAction {
    type: OppfolgingActionTypes.SetYtelserEkspandert;
    ekspandert: boolean;
}

export type OppfolgingActions = SetValgtPeriode | SetSykefraværEkspandertAction | SetYtelserEkspandertAction;
