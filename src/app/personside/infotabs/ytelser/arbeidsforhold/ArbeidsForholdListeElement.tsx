import * as React from 'react';
import { datoEllerNull, NOKellerNull } from '../../../../../utils/string-utils';
import { FormatertKontonummer } from '../../../../../utils/FormatertKontonummer';
import DescriptionList from '../../../../../components/DescriptionList';
import { Arbeidsforhold } from '../../../../../models/ytelse/arbeidsforhold';

interface Props {
    arbeidsforhold: Arbeidsforhold;
}

function ArbeidsForholdListeElement({ arbeidsforhold }: Props) {
    const arbeidsForholdEntries = {
        Arbeidsgiver: arbeidsforhold.arbeidsgiverNavn,
        Kontonummer: arbeidsforhold.arbeidsgiverKontonr && (
            <FormatertKontonummer kontonummer={arbeidsforhold.arbeidsgiverKontonr} />
        ),
        Inntekstsperiode: arbeidsforhold.inntektsperiode,
        'Inntekt for perioden': NOKellerNull(arbeidsforhold.inntektForPerioden),
        Refusjonstype: arbeidsforhold.refusjonstype,
        'Refusjon til dato': datoEllerNull(arbeidsforhold.refusjonTom),
        'Sykepenger fra og med': datoEllerNull(arbeidsforhold.sykepengerFom)
    };

    return (
        <li>
            <DescriptionList entries={arbeidsForholdEntries} />
        </li>
    );
}

export default ArbeidsForholdListeElement;
