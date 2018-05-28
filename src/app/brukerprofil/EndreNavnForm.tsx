import * as React from 'react';
import { ChangeEvent, FormEvent } from 'react';
import { Action } from 'history';
import { connect, Dispatch } from 'react-redux';
import styled from 'styled-components';

import AlertStripe from 'nav-frontend-alertstriper';
import Input from 'nav-frontend-skjema/lib/input';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import KnappBase from 'nav-frontend-knapper';

import { STATUS } from '../../redux/utils';
import { EndreNavnRequest } from '../../redux/brukerprofil/endreNavnRequest';
import { Person } from '../../models/person/person';
import { AppState } from '../../redux/reducer';
import { endreNavn, reset } from '../../redux/brukerprofil/endreNavn';
import { VeilederRoller } from '../../models/veilederRoller';

const TilbakemeldingWrapper = styled.div`
  margin-top: 1em;
`;

interface State {
    fornavnInput: string;
    mellomnavnInput: string;
    etternavnInput: string;
}

interface DispatchProps {
    endreNavn: (request: EndreNavnRequest) => void;
    resetEndreNavnReducer: () => void;
}

interface StateProps {
    status: STATUS;
}

interface OwnProps {
    person: Person;
    veilederRoller?: VeilederRoller;
}

type Props = DispatchProps & StateProps & OwnProps;

class EndreNavnForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            fornavnInput: props.person.navn.fornavn || '',
            mellomnavnInput: props.person.navn.mellomnavn || '',
            etternavnInput: props.person.navn.etternavn || '',
        };

        this.fornavnInputChange = this.fornavnInputChange.bind(this);
        this.mellomnavnInputChange = this.mellomnavnInputChange.bind(this);
        this.etternavnInputChange = this.etternavnInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        this.props.resetEndreNavnReducer();
    }

    fornavnInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            fornavnInput: event.target.value
        });
        this.props.resetEndreNavnReducer();
    }

    mellomnavnInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            mellomnavnInput: event.target.value
        });
        this.props.resetEndreNavnReducer();

    }

    etternavnInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            etternavnInput: event.target.value
        });
        this.props.resetEndreNavnReducer();
    }

    navnErEndret() {
        const fornavnErEndret = this.state.fornavnInput !== this.props.person.navn.fornavn;
        const mellomnavnErEndret = this.state.mellomnavnInput !== this.props.person.navn.mellomnavn;
        const etternavnErEndret = this.state.etternavnInput !== this.props.person.navn.etternavn;
        return fornavnErEndret || mellomnavnErEndret || etternavnErEndret;
    }

    handleSubmit(event: FormEvent<HTMLFormElement>) {
        this.props.endreNavn({
            fødselsnummer: this.props.person.fødselsnummer,
            fornavn: this.state.fornavnInput,
            mellomnavn: this.state.mellomnavnInput,
            etternavn: this.state.etternavnInput
        });
        event.preventDefault();
    }

    harVeilderPåkrevdRolle() {
        if (!this.props.veilederRoller) {
            return false;
        }
        return this.props.veilederRoller.roller.includes('0000-GA-BD06_EndreNavn');
    }

    render() {
        const harIkkeTilgang = !this.harVeilderPåkrevdRolle();
        return (
                <form onSubmit={this.handleSubmit}>
                    <Undertittel>Navn</Undertittel>
                    <Input
                        label="Fornavn"
                        value={this.state.fornavnInput}
                        onChange={this.fornavnInputChange}
                        disabled={harIkkeTilgang}
                    />
                    <Input
                        label="Mellomnavn"
                        value={this.state.mellomnavnInput}
                        onChange={this.mellomnavnInputChange}
                        disabled={harIkkeTilgang}
                    />
                    <Input
                        label="Etternavn"
                        value={this.state.etternavnInput}
                        onChange={this.etternavnInputChange}
                        disabled={harIkkeTilgang}
                    />
                    <KnappBase
                        type="standard"
                        spinner={this.props.status === STATUS.PENDING}
                        disabled={harIkkeTilgang || !this.navnErEndret()}
                        autoDisableVedSpinner={true}
                    >
                        Endre navn
                    </KnappBase>
                    <TilbakemeldingWrapper><Tilbakemelding status={this.props.status}/></TilbakemeldingWrapper>
                </form>

        );
    }
}

function Tilbakemelding(props: {status: STATUS}) {
    if (props.status === STATUS.OK) {
        return (
            <AlertStripe
                type={'suksess'}
            >
                Navnet ble endret. Det kan ta noen minutter før endringene blir synlig.
            </AlertStripe>
        );
    } else if (props.status === STATUS.ERROR) {
        return (
            <AlertStripe type={'advarsel'}>Det skjedde en feil ved endring av navn.</AlertStripe>
        );
    } else {
        return null;
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return ({
        status: state.endreNavn.status,
    });
};

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        endreNavn: (request: EndreNavnRequest) => dispatch(endreNavn(request)),
        resetEndreNavnReducer: () => dispatch(reset()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (EndreNavnForm);