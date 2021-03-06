import * as React from 'react';
import DescriptionList, { DescriptionListEntries } from '../../../../../components/DescriptionList';
import { convertBoolTilJaNei } from '../../../../../utils/string-utils';
import YtelserInfoGruppe from '../felles-styling/YtelserInfoGruppe';
import { Sykepenger } from '../../../../../models/ytelse/sykepenger';
import ArbeidsForholdListe from './ArbeidsforholdListe';

interface Props {
    sykepenger: Sykepenger;
}

function Arbeidssituasjon(props: Props) {
    const sykemeldingEntries: DescriptionListEntries = {
        Arbeidsgiverperiode: convertBoolTilJaNei(props.sykepenger.erArbeidsgiverperiode),
        Arbeidskategori: props.sykepenger.arbeidskategori
    };

    return (
        <YtelserInfoGruppe tittel="Arbeidssituasjon">
            <DescriptionList entries={sykemeldingEntries} />
            <ArbeidsForholdListe ytelse={props.sykepenger} arbeidsForhold={props.sykepenger.arbeidsforholdListe} />
        </YtelserInfoGruppe>
    );
}

export default Arbeidssituasjon;
