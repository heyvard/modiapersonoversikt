import { KodeverkResponse, TilrettelagtKommunikasjonType } from '../../models/kodeverk';

const mockKodeverk = [
    {
        type: TilrettelagtKommunikasjonType.TALESPRAK,
        value: 'Svensk',
        kodeRef: 'SV',
        kodeverkRef: null,
        beskrivelse: 'Svensk',
        gyldig: true
    },
    {
        value: 'Ledsager',
        kodeRef: 'LESA',
        kodeverkRef: null,
        beskrivelse: 'Ledsager',
        gyldig: true
    },
    {
        value: 'Muntlig kommunikasjon',
        kodeRef: 'KOMU',
        kodeverkRef: null,
        beskrivelse: 'Muntlig kommunikasjon',
        gyldig: true
    },
    {
        value: 'Skriftlig kommunikasjon',
        kodeRef: 'KOSK',
        kodeverkRef: null,
        beskrivelse: 'Skriftlig kommunikasjon',
        gyldig: true
    },
    {
        value: 'Telepati',
        kodeRef: 'TELE',
        kodeverkRef: null,
        beskrivelse: 'Telepatisk kommunikasjon',
        gyldig: true
    }
];

export function mockTilrettelagtKommunikasjonKodeverk(): KodeverkResponse {
    return {
        kodeverk: mockKodeverk
    };
}
