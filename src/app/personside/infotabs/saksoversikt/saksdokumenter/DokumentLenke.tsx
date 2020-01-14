import { Element } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { Dokument, Journalpost } from '../../../../../models/saksoversikt/journalpost';
import { useInfotabsDyplenker } from '../../dyplenker';
import { Sakstema } from '../../../../../models/saksoversikt/sakstema';
import { paths } from '../../../../routes/routing';
import { useFødselsnummer } from '../../../../../utils/customHooks';
import { getSaksdokumentUrl } from '../dokumentvisning/getSaksdokumentUrl';
import { FeatureToggles } from '../../../../../components/featureToggle/toggleIDs';
import { erSakerFullscreen } from '../utils/erSakerFullscreen';
import useFeatureToggle from '../../../../../components/featureToggle/useFeatureToggle';

interface Props {
    dokument: Dokument;
    valgtSakstema: Sakstema;
    kanVises: boolean;
    journalPost: Journalpost;
}

const dokumentTekst = (dokument: Dokument) => {
    return dokument.tittel + (dokument.skjerming ? ' (Skjermet)' : '');
};

export function getUrlSaksdokumentEgetVindu(fødselsnummer: string, journalpostId: string, dokumentReferanse: string) {
    const saksdokumentUrl = getSaksdokumentUrl(fødselsnummer, journalpostId, dokumentReferanse);

    return `${paths.saksdokumentEgetVindu}/${fødselsnummer}?dokumenturl=${saksdokumentUrl}`;
}

function DokumentLenke(props: Props) {
    const fødselsnummer = useFødselsnummer();
    const dyplenker = useInfotabsDyplenker();
    const apneDokumenterIEgetVinduFT = useFeatureToggle(FeatureToggles.SaksDokumentIEgetVindu);

    if (!props.kanVises) {
        return <Element>{dokumentTekst(props.dokument)}</Element>;
    }

    const apneDokumentINyttVindu = apneDokumenterIEgetVinduFT.isOn && !erSakerFullscreen();
    const url = apneDokumentINyttVindu
        ? getUrlSaksdokumentEgetVindu(fødselsnummer, props.journalPost.journalpostId, props.dokument.dokumentreferanse)
        : dyplenker.saker.link(props.valgtSakstema, props.dokument);

    return (
        <Link
            to={url}
            target={apneDokumentINyttVindu ? '_blank' : undefined}
            aria-disabled={!props.dokument.kanVises}
            className="lenke typo-element"
        >
            {dokumentTekst(props.dokument)}
        </Link>
    );
}

export default DokumentLenke;