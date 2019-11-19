import {
    ForsettDialogRequest,
    LestStatus,
    Melding,
    Meldingstype,
    SendDelsvarRequest,
    SendReferatRequest,
    SendSpørsmålRequest,
    Traad
} from '../models/meldinger/meldinger';
import { guid } from 'nav-frontend-js-utils';
import moment from 'moment';
import { backendDatoTidformat } from './utils/mock-utils';
import { getMockTraader } from './meldinger/meldinger-mock';
import { Temagruppe } from '../models/Temagrupper';

export class MeldingerBackendMock {
    private sendteNyeMeldinger: Traad[] = [];
    private sendteSvar: Traad[] = [];
    private fnr: string = '';

    private clearSendteMeldingerOnNewFnr(fnr: string) {
        if (fnr !== this.fnr) {
            this.sendteNyeMeldinger = [];
            this.sendteSvar = [];
            this.fnr = fnr;
        }
    }

    public getMeldinger(fnr: string): Traad[] {
        this.clearSendteMeldingerOnNewFnr(fnr);
        const mockTraader = getMockTraader(fnr);

        const alleTråder = [...this.sendteNyeMeldinger, ...mockTraader];

        const traaderMedSvar: Traad[] = alleTråder.map(traad => {
            const tilhørendeSvar = this.sendteSvar
                .filter(svar => svar.traadId === traad.traadId)
                .flatMap(traad => traad.meldinger);
            return {
                traadId: traad.traadId,
                meldinger: [...tilhørendeSvar, ...traad.meldinger]
            };
        });

        return traaderMedSvar;
    }

    public sendReferat(request: SendReferatRequest) {
        const melding: Melding = {
            ...getMockMelding(),
            meldingstype: request.meldingstype,
            temagruppe: request.temagruppe,
            fritekst: request.fritekst
        };
        this.sendteNyeMeldinger.unshift({
            traadId: guid(),
            meldinger: [melding]
        });
    }

    public sendSpørsmål(request: SendSpørsmålRequest) {
        const melding: Melding = {
            ...getMockMelding(),
            meldingstype: Meldingstype.SPORSMAL_MODIA_UTGAAENDE,
            fritekst: request.fritekst
        };
        this.sendteNyeMeldinger.unshift({
            traadId: guid(),
            meldinger: [melding]
        });
    }

    public sendSvar(request: ForsettDialogRequest) {
        const melding: Melding = {
            ...getMockMelding(),
            fritekst: request.fritekst,
            meldingstype: request.meldingstype
        };
        this.sendteSvar.unshift({
            traadId: request.traadId,
            meldinger: [melding]
        });
    }

    public sendDelsvar(request: SendDelsvarRequest) {
        const melding: Melding = {
            ...getMockMelding(),
            fritekst: request.fritekst,
            meldingstype: Meldingstype.DELVIS_SVAR_SKRIFTLIG,
            temagruppe: request.temagruppe
        };
        this.sendteSvar.unshift({
            traadId: request.traadId,
            meldinger: [melding]
        });
    }
}

function getMockMelding(): Melding {
    return {
        id: guid(),
        meldingstype: Meldingstype.SPORSMAL_SKRIFTLIG,
        temagruppe: Temagruppe.Arbeid,
        skrevetAvTekst: 'Saksbehandler',
        fritekst: 'Dette er en mock-melding',
        status: LestStatus.IkkeLest,
        opprettetDato: moment().format(backendDatoTidformat),
        erFerdigstiltUtenSvar: false,
        erDokumentMelding: false
    };
}