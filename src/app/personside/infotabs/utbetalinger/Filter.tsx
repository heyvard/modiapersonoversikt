import * as React from 'react';
import styled from 'styled-components';
import { Radio } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import EtikettMini from '../../../../components/EtikettMini';
import NavDatovelger from 'nav-datovelger';
import { Feilmelding } from '../../../../utils/Feilmelding';
import * as moment from 'moment';
import LazySpinner from '../../../../components/LazySpinner';
import { UtbetalingerResponse } from '../../../../models/utbetalinger';
import { RestReducer } from '../../../../redux/restReducers/restReducer';
import Innholdslaster from '../../../../components/Innholdslaster';
import UtbetaltTilValg from './UtbetaltTilValg';
import YtelseValg from './YtelseValg';

export interface FilterState {
    periode: PeriodeOptions;
    utbetaltTil: Array<string>;
    ytelser: Array<string>;
}

interface PeriodeOptions {
    radioValg: PeriodeValg;
    egendefinertPeriode: FraTilDato;
}

export interface FraTilDato {
    fra: Date;
    til: Date;
}

interface Props {
    onChange: (change: Partial<FilterState>) => void;
    filterState: FilterState;
    showSpinner: boolean;
    utbetalingReducer: RestReducer<UtbetalingerResponse>;
}

export enum PeriodeValg {
    SISTE_30_DAGER = 'Siste 30 dager',
    INNEVÆRENDE_ÅR = 'Inneværende år',
    I_FJOR = 'I fjor',
    EGENDEFINERT = 'Egendefinert'
}

const FiltreringsPanel = styled.nav`
  > *:first-child {
    margin-top: 2em;
  }
`;

const InputPanel = styled.form`
  display: inline-flex;
  flex-direction: column;
  min-width: 33%;
  margin-top: 1em;
  &:not(:last-child) {
    padding-right: 1rem;
  }
  > *:not(:last-child) {
    margin-bottom: 1em;
  }
`;

const Opacity = styled.span`
  opacity: .5;
`;

function onRadioChange(props: Props, key: PeriodeValg) {
    props.onChange({
        periode: {
            ...props.filterState.periode,
            radioValg: key
        }
    });
}

function onDatoChange(props: Props, dato: Partial<FraTilDato>) {
    const newPeriode: FraTilDato = {
        fra: dato.fra && moment(dato.fra).isValid()
            ? dato.fra
            : new Date(props.filterState.periode.egendefinertPeriode.fra),
        til: dato.til && moment(dato.til).isValid()
            ? dato.til
            : new Date(props.filterState.periode.egendefinertPeriode.til)
    };
    props.onChange({
        periode: {
            ...props.filterState.periode,
            egendefinertPeriode: newPeriode
        }
    });
}

function egendefinertDatoInputs(props: Props) {

    const fra = props.filterState.periode.egendefinertPeriode.fra;
    const til = props.filterState.periode.egendefinertPeriode.til;
    const periodeFeilmelding = fra && til && fra > til ?
        <Feilmelding feil={{feilmelding: 'Fra-dato kan ikke være senere enn til-dato'}}/> : null;

    return (
        <>
            <label htmlFor="utbetalinger-datovelger-fra">Fra:</label>
            <NavDatovelger
                dato={props.filterState.periode.egendefinertPeriode.fra}
                id={'utbetalinger-datovelger-fra'}
                onChange={dato => onDatoChange(props, {fra: dato})}
            />
            <label htmlFor="utbetalinger-datovelger-til">Til:</label>
            <NavDatovelger
                dato={props.filterState.periode.egendefinertPeriode.til}
                id={'utbetalinger-datovelger-til'}
                onChange={dato => onDatoChange(props, {til: dato})}
            />
            {periodeFeilmelding}
        </>
    );
}

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin: 0;
  }
  > :nth-child(2) {
    margin-left: .5rem;
  }
`;

function Filtrering(props: Props) {

    const radios = Object.keys(PeriodeValg).map(key => {
        const label = PeriodeValg[key];
        const checked = props.filterState.periode.radioValg === label;
        return (
            <RadioWrapper key={label}>
                <Radio
                    label={label}
                    checked={checked}
                    onChange={() => onRadioChange(props, PeriodeValg[key])}
                    name="FiltreringsvalgGruppe"
                />
                {checked && props.showSpinner && <LazySpinner type="S"/>}
            </RadioWrapper>);
    });

    return (
        <FiltreringsPanel>
            <Element>Filtrering</Element>

            <InputPanel>
                <EtikettMini><Opacity>Velg periode</Opacity></EtikettMini>
                {radios}
                {props.filterState.periode.radioValg === PeriodeValg.EGENDEFINERT && egendefinertDatoInputs(props)}
            </InputPanel>

            <Innholdslaster avhengigheter={[props.utbetalingReducer]} spinnerSize={'M'}>
                <InputPanel>
                    <EtikettMini><Opacity>Utbetaling til</Opacity></EtikettMini>
                    <UtbetaltTilValg
                        utbetalinger={props.utbetalingReducer.data.utbetalinger}
                        onChange={props.onChange}
                        filterState={props.filterState}
                    />
                </InputPanel>
                <InputPanel>
                    <EtikettMini><Opacity>Velg ytelse</Opacity></EtikettMini>
                    <YtelseValg
                        onChange={props.onChange}
                        filterState={props.filterState}
                        utbetalinger={props.utbetalingReducer.data.utbetalinger}
                    />
                </InputPanel>
            </Innholdslaster>

        </FiltreringsPanel>
    );
}

export default Filtrering;
