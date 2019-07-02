export interface Traad {
    traadId: string;
    meldinger: Melding[];
}

export interface Melding {
    id: string;
    meldingstype: Meldingstype;
    temagruppe: Temagruppe;
    skrevetAv: Saksbehandler;
    journalfortAv: Saksbehandler;
    fritekst: string;
    lestDato?: string;
    status: LestStatus;
    opprettetDato: string;
    journalfortDato: string;
    ferdigstiltDato: string;
    erFerdigstiltUtenSvar: boolean;
}

export interface Saksbehandler {
    fornavn: string;
    etternavn: string;
    ident?: string;
}

export enum TypeKontakt {
    Telefon = 'telefon',
    Oppmøte = 'oppmote',
    Oppgave = 'oppgave',
    Dokument = 'dokument',
    Monolog = 'monolog',
    MonologUbesvart = 'monlog ubesvart',
    Dialog = 'dialog',
    DialogBesvart = 'dialog besvart'
}

export enum Temagruppe {
    Uføretrygd = 'UFRT',
    Familie = 'FMLI',
    Hjelpemiddel = 'HJLPM',
    Bil = 'BIL',
    OrtopediskHjelpemiddel = 'ORT_HJE',
    Øvrig = 'OVRG',
    PleiepengerBarnsSykdom = 'PLEIEPENGERSY',
    Utland = 'UTLAND',
    Pensjon = 'PENS',
    Arbeid = 'ARBD',
    AndreSosiale = 'ANSOS',
    ØkonomiskSosial = 'OKSOS'
}

export enum Meldingstype {
    DokumentVarsel = 'DOKUMENT_VARSEL',
    OppgaveVarsel = 'OPPGAVE_VARSEL',
    SPORSMAL_SKRIFTLIG = 'SPORSMAL_SKRIFTLIG',
    SvarSkriftlig = 'SVAR_SKRIFTLIG',
    SVAR_OPPMOTE = 'SVAR_OPPMOTE',
    SVAR_TELEFON = 'SVAR_TELEFON',
    DelvisSvarSkriftlig = 'DELVIS_SVAR_SKRIFTLIG',
    SAMTALEREFERAT_OPPMOTE = 'SAMTALEREFERAT_OPPMOTE',
    SAMTALEREFERAT_TELEFON = 'SAMTALEREFERAT_TELEFON',
    SPORSMAL_MODIA_UTGAAENDE = 'SPORSMAL_MODIA_UTGAAENDE',
    SvarSblInngående = 'SVAR_SBL_INNGAAENDE'
}

export enum LestStatus {
    IkkeLest = 'IKKE_LEST_AV_BRUKER',
    Lest = 'LEST_AV_BRUKER',
    IkkeBesvart = 'IKKE_BESVART'
}

export interface SendMeldingRequest {
    fnr: string;
    navident: string;
    kanal: string;
    type: string | null;
    fritekst: string;
    tilknyttetEnhet: string;
    erTilknyttetAnsatt: boolean;
    traadId: string | null;
    kontorsperretEnhet: string | null;
    temagruppe: string;
}
