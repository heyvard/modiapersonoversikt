import { apiBaseUri } from '../config';
import { post } from '../api';
import { Gateadresse, Matrikkeladresse, Postboksadresse, Utlandsadresse } from '../../models/personadresse';
import { Periode } from '../../models/periode';

export interface EndreAdresseRequest {
    norskAdresse: {
        gateadresse: EndreGateadresseRequest | null;
        matrikkeladresse: EndreMatrikkeladresseRequest | null;
        postboksadresse: EndrePostboksadresseRequest | null;
    } | null;
    utlandsadresse:  {

    } | null;
}

export interface EndreGateadresseRequest {
    tilleggsadresse?: string;
    gatenavn: string;
    husnummer?: string;
    husbokstav?: string;
    postnummer: string;
    bolignummer?: string;
    gyldigTil: string;
}

export interface EndreMatrikkeladresseRequest {
    tilleggsadresse?: string;
    eiendomsnavn?: string;
    postnummer: string;
    gyldigTil: string;
}

interface EndrePostboksadresseRequest {
    postboksnummer: string;
    postnummer: string;
    tilleggsadresse?: string;
    postboksanlegg?: string;
    gyldigTil: string;
}

function postEndreAdresse(fødselsnummer: string, request: EndreAdresseRequest): Promise<{}> {
    console.log(request);
    return post(`${apiBaseUri}/brukerprofil/${fødselsnummer}/adresse/`, request);
}

function getGyldigTil(periode?: Periode) {
    if (!periode) {
        throw 'Ugyldig periode for endring av adresse';
    }
    return periode.til;
}

export function postEndreNorskGateadresse(fødselsnummer: string, gateadresse: Gateadresse) {
    const {poststed, periode, ...mappedGateadresse} = gateadresse;
    const request: EndreAdresseRequest = {
        norskAdresse: {
            gateadresse: {
                ...mappedGateadresse,
                gyldigTil: getGyldigTil(gateadresse.periode)},
            matrikkeladresse: null,
            postboksadresse: null
        },
        utlandsadresse: null
    };
    return postEndreAdresse(fødselsnummer, request);
}

export function postEndreMatrikkeladresse(fødselsnummer: string, matrikkeladresse: Matrikkeladresse) {
    const {poststed, periode, ...mappedMatrikkeladresse} = matrikkeladresse;
    const request: EndreAdresseRequest = {
        norskAdresse: {
            gateadresse: null,
            postboksadresse: null,
            matrikkeladresse: {
                ...mappedMatrikkeladresse,
                gyldigTil: getGyldigTil(matrikkeladresse.periode)},
        },
        utlandsadresse: null
    };
    return postEndreAdresse(fødselsnummer, request);
}

export function postEndrePostboksadresse(fødselsnummer: string, postboksadresse: Postboksadresse) {
    const {poststed, periode, ...mappedPostboksadresse} = postboksadresse;
    const request: EndreAdresseRequest = {
        norskAdresse: {
            gateadresse: null,
            matrikkeladresse: null,
            postboksadresse: {
                ...mappedPostboksadresse,
                gyldigTil: getGyldigTil(postboksadresse.periode)
            }
        },
        utlandsadresse: null
    };
    return postEndreAdresse(fødselsnummer, request);
}

export function postSlettMidlertidigeAdresser(fødselsnummer: string) {
    const request: EndreAdresseRequest = {
        norskAdresse: null,
        utlandsadresse: null
    };
    return postEndreAdresse(fødselsnummer, request);
}

export function postEndreUtenlandsadresse(fødselsnummer: string, adresse: Utlandsadresse) {
    const request: EndreAdresseRequest = {
        norskAdresse: null,
        utlandsadresse: adresse
    };

    return postEndreAdresse(fødselsnummer, request);
}