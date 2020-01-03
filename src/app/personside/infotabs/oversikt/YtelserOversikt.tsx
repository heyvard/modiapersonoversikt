import * as React from 'react';
import { getSykepengerIdDato, getUnikSykepengerKey, Sykepenger } from '../../../../models/ytelse/sykepenger';
import { getUnikPleiepengerKey, Pleiepengerettighet } from '../../../../models/ytelse/pleiepenger';
import {
    Foreldrepengerettighet,
    getForeldepengerIdDato,
    getUnikForeldrepengerKey
} from '../../../../models/ytelse/foreldrepenger';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import theme from '../../../../styles/personOversiktTheme';
import VisMerKnapp from '../../../../components/VisMerKnapp';
import useBrukersYtelser from '../ytelser/useBrukersYtelser';
import { CenteredLazySpinner } from '../../../../components/LazySpinner';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { useInfotabsDyplenker } from '../dyplenker';
import { ytelserTest } from '../dyplenkeTest/utils';
import { formaterDato } from '../../../../utils/stringFormatting';
import { ReactNode, useEffect } from 'react';
import { usePrevious } from '../../../../utils/customHooks';
import { datoSynkende } from '../../../../utils/dateUtils';

const YtelserStyle = styled.div`
    > *:not(:first-child) {
        border-top: ${theme.border.skille};
    }
`;

interface Props {
    setHeaderContent: (content: ReactNode) => void;
}

function YtelserOversikt(props: Props) {
    const { ytelser, pending, feilmeldinger } = useBrukersYtelser({
        renderPleiepenger: pleiepenger => (
            <PleiepengerKomponent pleiepenger={pleiepenger} key={getUnikPleiepengerKey(pleiepenger)} />
        ),
        renderForeldrepenger: foreldrepenger => (
            <ForeldrepengerKomponent foreldrepenger={foreldrepenger} key={getUnikForeldrepengerKey(foreldrepenger)} />
        ),
        renderSykepenger: sykepenger => (
            <SykepengerKomponent sykepenger={sykepenger} key={getUnikSykepengerKey(sykepenger)} />
        )
    });

    const ytelserListe = ytelser.slice(0, 2);

    const prevAntallYtelser = usePrevious(ytelser.length);
    useEffect(() => {
        const antallYtelser = ytelser.length;
        if (prevAntallYtelser !== antallYtelser) {
            props.setHeaderContent(
                <Normaltekst>
                    {ytelserListe.length} / {antallYtelser}
                </Normaltekst>
            );
        }
    }, [ytelser, ytelserListe, props, prevAntallYtelser]);

    return (
        <YtelserStyle>
            {ytelserListe}
            {feilmeldinger}
            {!pending && feilmeldinger.length === 0 && ytelser.length === 0 && (
                <AlertStripeInfo>
                    Det finnes ikke foreldrepenger, sykepenger eller pleiepenger for brukeren
                </AlertStripeInfo>
            )}
            {pending && <CenteredLazySpinner padding={theme.margin.layout} />}
        </YtelserStyle>
    );
}

function PleiepengerKomponent(props: { pleiepenger: Pleiepengerettighet }) {
    const dyplenker = useInfotabsDyplenker();
    return (
        <VisMerKnapp
            linkTo={dyplenker.ytelser.link(getUnikPleiepengerKey(props.pleiepenger))}
            valgt={false}
            ariaDescription="Vis pleiepenger"
            className={ytelserTest.oversikt}
        >
            <Element>Pleiepenger sykt barn</Element>
            <Normaltekst>Barnets f.nr: {props.pleiepenger.barnet}</Normaltekst>
        </VisMerKnapp>
    );
}

function SykepengerKomponent(props: { sykepenger: Sykepenger }) {
    const dyplenker = useInfotabsDyplenker();

    const idDato = formaterDato(getSykepengerIdDato(props.sykepenger));
    const tomDatoForSykmelding = formaterDato(
        props.sykepenger.sykmeldinger.sort(datoSynkende(it => it.sykmeldt.til))[0].sykmeldt.til
    );
    return (
        <VisMerKnapp
            linkTo={dyplenker.ytelser.link(getUnikSykepengerKey(props.sykepenger))}
            valgt={false}
            ariaDescription="Vis sykepenger"
            className={ytelserTest.oversikt}
        >
            <Element>Sykepenger</Element>
            <Normaltekst>
                ID dato: {idDato} - Sykmeldt til: {tomDatoForSykmelding}
            </Normaltekst>
            <Normaltekst>
                100% sykemeldt - Maksdato{' '}
                {props.sykepenger.slutt ? formaterDato(props.sykepenger.slutt) : 'ikke tilgjenglig'}
            </Normaltekst>
        </VisMerKnapp>
    );
}

function ForeldrepengerKomponent(props: { foreldrepenger: Foreldrepengerettighet }) {
    const dyplenker = useInfotabsDyplenker();
    return (
        <VisMerKnapp
            linkTo={dyplenker.ytelser.link(getUnikForeldrepengerKey(props.foreldrepenger))}
            valgt={false}
            ariaDescription="Vis foreldrepenger"
            className={ytelserTest.oversikt}
        >
            <Element>Foreldrepenger</Element>
            <Normaltekst>ID dato: {formaterDato(getForeldepengerIdDato(props.foreldrepenger))}</Normaltekst>
            <Normaltekst>
                {props.foreldrepenger.dekningsgrad}% dekningsgrad - Maksdato{' '}
                {props.foreldrepenger.slutt ? formaterDato(props.foreldrepenger.slutt) : 'ikke tilgjengelig'}
            </Normaltekst>
        </VisMerKnapp>
    );
}

export default YtelserOversikt;
