import * as React from 'react';
import { PersonsokRequest, PersonsokResponse } from '../../models/person/personsok';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { apiBaseUri, postConfig } from '../../api/config';
import { FetchResponse, fetchToJson } from '../../utils/fetchToJson';
import { PersonSokFormState, lagRequest } from './personsok-utils';
import { loggError } from '../../utils/logger/frontendLogger';
import useFormstate, { FunctionValidator, Values } from '@nutgaard/use-formstate';
import { Systemtittel } from 'nav-frontend-typografi';
import { Input, Select } from 'nav-frontend-skjema';
import PersonsokDatovelger from './PersonsokDatovelger';
import { Kjønn } from '../../models/person/person';
import LenkeDrek, { DrekProps } from './LenkeDrek';
import { Hovedknapp } from 'nav-frontend-knapper';
import { LenkeKnapp } from '../../components/common-styled-components';
import styled from 'styled-components/macro';
import theme from '../../styles/personOversiktTheme';
import { erTall } from '../../utils/string-utils';
import { removeWhitespaceAndDot, validerKontonummer } from './kontonummer/kontonummerUtils';
import { feilmelding } from '../personside/infotabs/meldinger/traadvisning/verktoylinje/oppgave/validering';

interface Props {
    setResponse: (response: FetchResponse<PersonsokResponse[]>) => void;
    setPosting: (posting: boolean) => void;
}
const FormStyle = styled.article`
    padding: ${theme.margin.layout};
`;

const SectionStyle = styled.section`
    display: flex;
    > *:first-child {
        margin-right: 10rem;
    }
`;

const KnappStyle = styled.div`
    padding-top: ${theme.margin.layout};
    display: flex;
    justify-content: space-between;
`;

const InputLinje = styled.div`
    display: flex;
    .skjemaelement {
        padding-right: 0.5em;
    }
`;
export const validatorPersonsok: FunctionValidator<PersonSokFormState> = values => {
    let fornavn = undefined;
    if (!values.fornavn && values.etternavn) {
        fornavn = 'Fornavn må være utfylt hvis etternavn er satt';
    }

    const etternavn = undefined;

    let gatenavn = undefined;
    if (!values.gatenavn && values.husnummer) {
        gatenavn = 'Gatenavn må være satt hvis husnummer er satt';
    }
    if (!values.gatenavn && values.husbokstav) {
        gatenavn = 'Gatenavn må være satt hvis husbokstav er satt';
    }
    if (!values.gatenavn && values.postnummer) {
        gatenavn = 'Gatenavn må være satt hvis postnummer er satt';
    }

    const husnummer = !erTall(values.husnummer) ? 'Husnummer må være tall' : undefined;

    const husbokstav = undefined;

    const postnummer = !erTall(values.postnummer) ? 'Postnummer må være tall' : undefined;

    let kontonummer = undefined;
    if (values.kontonummer && !validerKontonummer(removeWhitespaceAndDot(values.kontonummer))) {
        kontonummer = 'Kontonummer må være gyldig';
    }

    const kommunenummer =
        !erTall(values.kommunenummer) && values.kommunenummer.length !== 4
            ? 'Bosted må være tall med 4 siffer'
            : undefined;

    let fodselsdatoFra = undefined;
    let fodselsdatoTil = undefined;
    const fra = new Date(values.fodselsdatoFra);
    const til = new Date(values.fodselsdatoTil);
    if (fra > til) {
        fodselsdatoFra = 'Fra-dato kan ikke være senere enn til-dato';
    }
    if (til > new Date(Date.now())) {
        fodselsdatoTil = 'Du kan ikke velge dato frem i tid';
    }
    const alderFra = !erTall(values.alderFra) ? 'Alder må være tall' : undefined;
    const alderTil = !erTall(values.alderTil) ? 'Alder må være tall' : undefined;
    const kjonn = undefined;

    let _minimumskrav = undefined;
    if (!values.gatenavn && !values.kontonummer && !values.fornavn) {
        _minimumskrav = 'Du må minimum fylle inn navn, adresse eller kontonummer for å gjøre søk';
        fornavn = '';
        gatenavn = '';
        kontonummer = '';
    }

    return {
        fornavn,
        etternavn,
        gatenavn,
        husnummer,
        husbokstav,
        postnummer,
        kontonummer,
        kommunenummer,
        fodselsdatoFra,
        fodselsdatoTil,
        alderFra,
        alderTil,
        kjonn,
        _minimumskrav
    };
};

const initialValues: PersonSokFormState = {
    fornavn: '',
    etternavn: '',
    gatenavn: '',
    husnummer: '',
    husbokstav: '',
    postnummer: '',
    kontonummer: '',
    kommunenummer: '',
    fodselsdatoFra: '',
    fodselsdatoTil: '',
    alderFra: '',
    alderTil: '',
    kjonn: '',
    _minimumskrav: ''
};

function PersonsokSkjema(props: Props) {
    const validator = useFormstate<PersonSokFormState>(validatorPersonsok);
    const state = validator(initialValues);

    function submitHandler<S>(values: Values<PersonSokFormState>): Promise<any> {
        props.setPosting(true);
        const request: PersonsokRequest = lagRequest(values);
        return fetchToJson<PersonsokResponse[]>(`${apiBaseUri}/personsok`, postConfig(request))
            .then(response => {
                props.setPosting(false);
                props.setResponse(response);
            })
            .catch(() => {
                loggError(Error('Noe gikk galt - Personsøk'));
            });
    }

    const drekProps: DrekProps = {
        fornavn: state.fields.fornavn.input.value,
        etternavn: state.fields.etternavn.input.value,
        fodselsdatoFra: state.fields.fodselsdatoFra.input.value,
        kjonn: state.fields.kjonn.input.value
    };

    return (
        <form
            onSubmit={state.onSubmit(submitHandler)}
            onReset={() => {
                state.reinitialize(initialValues);
            }}
        >
            <FormStyle>
                <SectionStyle>
                    <section aria-label={'Søkekriterier'}>
                        <Systemtittel tag={'h2'}>Søkekriterier</Systemtittel>
                        <InputLinje>
                            <Input
                                bredde={'XL'}
                                label={'Fornavn (Fonetisk søk)'}
                                {...state.fields.fornavn.input}
                                feil={feilmelding(state.fields.fornavn)}
                            />
                            <Input
                                bredde={'XL'}
                                label={'Etternavn (Fonetisk søk)'}
                                {...state.fields.etternavn.input}
                                feil={feilmelding(state.fields.etternavn)}
                            />
                        </InputLinje>
                        <InputLinje>
                            <Input
                                bredde={'L'}
                                label={'Gatenavn'}
                                {...state.fields.gatenavn.input}
                                feil={feilmelding(state.fields.gatenavn)}
                            />
                            <Input
                                bredde={'M'}
                                label={'Husnummer'}
                                {...state.fields.husnummer.input}
                                feil={feilmelding(state.fields.husnummer)}
                            />
                            <Input bredde={'M'} label={'Husbokstav'} {...state.fields.husbokstav.input} />
                        </InputLinje>
                        <Input
                            bredde={'M'}
                            label={'Postnummer'}
                            {...state.fields.postnummer.input}
                            feil={feilmelding(state.fields.postnummer)}
                        />
                        <Input
                            bredde={'L'}
                            label={'Kontonummer (Norske nummer)'}
                            {...state.fields.kontonummer.input}
                            feil={feilmelding(state.fields.kontonummer)}
                        />
                    </section>
                    <section aria-label={'Begrens søket'}>
                        <Systemtittel tag={'h2'}>Begrens søket</Systemtittel>
                        <Input
                            bredde={'M'}
                            label={'Bosted'}
                            {...state.fields.kommunenummer.input}
                            feil={feilmelding(state.fields.kommunenummer)}
                        />
                        <InputLinje>
                            <PersonsokDatovelger form={state.fields} />
                        </InputLinje>
                        <InputLinje>
                            <Input
                                bredde={'M'}
                                label={'Alder fra'}
                                {...state.fields.alderFra.input}
                                feil={feilmelding(state.fields.alderFra)}
                            />
                            <Input
                                bredde={'M'}
                                label={'Alder til'}
                                {...state.fields.alderTil.input}
                                feil={feilmelding(state.fields.alderTil)}
                            />
                        </InputLinje>
                        <Select label={'Kjønn'} {...state.fields.kjonn.input}>
                            <option value={''} key={''}>
                                Velg Kjønn
                            </option>
                            <option value={Kjønn.Kvinne} key={'K'}>
                                K - Kvinne
                            </option>
                            <option value={Kjønn.Mann} key={'M'}>
                                M - Mann
                            </option>
                        </Select>
                    </section>
                </SectionStyle>
                <LenkeDrek props={drekProps} />
                <KnappStyle>
                    <Hovedknapp htmlType="submit">Søk</Hovedknapp>
                    <LenkeKnapp type="reset">Nullstill</LenkeKnapp>
                </KnappStyle>
            </FormStyle>
            {state.submittoken && state.fields._minimumskrav.error !== undefined && (
                <AlertStripeInfo>
                    <span role="alert">{state.fields._minimumskrav.error}</span>
                </AlertStripeInfo>
            )}
        </form>
    );
}

export default PersonsokSkjema;
