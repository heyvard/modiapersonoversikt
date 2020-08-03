import {
    ForsettDialogRequest,
    LestStatus,
    Melding,
    Meldingstype,
    OpprettHenvendelseRequest,
    OpprettHenvendelseResponse,
    SendDelsvarRequest,
    SendInfomeldingRequest,
    SendReferatRequest,
    SendSpørsmålRequest,
    Traad
} from '../../models/meldinger/meldinger';
import { guid } from 'nav-frontend-js-utils';
import { getMockTraader } from '../meldinger/meldinger-mock';
import { Temagruppe } from '../../models/temagrupper';
import { OppgaverBackendMock } from './oppgaverBackendMock';
import { backendDatoTidformat } from '../../utils/date-utils';

export class MeldingerBackendMock {
    private sendteNyeMeldinger: Traad[] = [];
    private sendteSvar: Traad[] = [];
    private fnr: string = '';
    private oppgaveBackendMock: OppgaverBackendMock;

    constructor(oppgaveBackendMock: OppgaverBackendMock) {
        this.oppgaveBackendMock = oppgaveBackendMock;
    }

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

    public sendReferat(request: SendReferatRequest): string {
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
        return melding.id;
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

    public sendInfomelding(request: SendInfomeldingRequest) {
        const melding: Melding = {
            ...getMockMelding(),
            meldingstype: Meldingstype.INFOMELDING_MODIA_UTGAAENDE,
            fritekst: request.fritekst
        };
        this.sendteNyeMeldinger.unshift({
            traadId: guid(),
            meldinger: [melding]
        });
    }

    public ferdigstillHenvendelse(request: ForsettDialogRequest) {
        if (request.oppgaveId) {
            this.oppgaveBackendMock.ferdigStillOppgave(request.oppgaveId);
        }
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
        if (request.oppgaveId) {
            this.oppgaveBackendMock.ferdigStillOppgave(request.oppgaveId);
        }
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

    public opprettHenvendelse(request: OpprettHenvendelseRequest): OpprettHenvendelseResponse {
        const oppgave = this.oppgaveBackendMock.getTildelteOppgaver().find(it => it.traadId === request.traadId);
        return {
            behandlingsId: guid(),
            oppgaveId: oppgave?.oppgaveId
        };
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
        opprettetDato: backendDatoTidformat(new Date(Date.now())),
        erFerdigstiltUtenSvar: false,
        erDokumentMelding: false
    };
}
