import { tekstMaksLengde } from '../sendMelding/SendNyMelding';
import { Meldingstype, Traad } from '../../../../models/meldinger/meldinger';
import { erEldsteMeldingJournalfort } from '../../infotabs/meldinger/utils/meldingerUtils';
import { FortsettDialogState } from './FortsettDialogTypes';
import { Temagruppe } from '../../../../models/temagrupper';

export class FortsettDialogValidator {
    public static tekst(state: FortsettDialogState) {
        return state.tekst.length <= tekstMaksLengde && state.tekst.length > 0;
    }
    public static sak(state: FortsettDialogState) {
        return state.sak !== undefined;
    }
    public static tema(state: FortsettDialogState) {
        return state.temagruppe !== undefined;
    }
    public static erGyldigSvarSkriftlig(state: FortsettDialogState) {
        return state.dialogType === Meldingstype.SVAR_SKRIFTLIG && this.tekst(state);
    }
    public static erGyldigSpørsmålSkriftlig(state: FortsettDialogState, traad: Traad) {
        const traadTemagruppe = traad.meldinger[0].temagruppe;
        if (traadTemagruppe === Temagruppe.ØkonomiskSosial) {
            return state.dialogType === Meldingstype.SPORSMAL_MODIA_UTGAAENDE && this.tekst(state);
        }
        return (
            state.dialogType === Meldingstype.SPORSMAL_MODIA_UTGAAENDE &&
            this.tekst(state) &&
            (this.sak(state) || erEldsteMeldingJournalfort(traad))
        );
    }
    public static erGyldigDelsvar(state: FortsettDialogState) {
        return state.dialogType === Meldingstype.DELVIS_SVAR_SKRIFTLIG && this.tekst(state) && this.tema(state);
    }
    public static erGyldigSvarOppmote(state: FortsettDialogState) {
        return state.dialogType === Meldingstype.SVAR_OPPMOTE && this.tekst(state);
    }
    public static erGyldigSvarTelefon(state: FortsettDialogState) {
        return state.dialogType === Meldingstype.SVAR_TELEFON && this.tekst(state);
    }
}
