import * as React from 'react';
import { connect } from 'react-redux';
import { AppState, Reducer } from '../../../../../redux/reducer';
import Epost from './Mobiltelefon';
import { Kontaktinformasjon } from '../../../../../models/kontaktinformasjon';

interface Props {
    kontaktinformasjon: Reducer<Kontaktinformasjon>;
}

class MobiltelefonContainer extends React.Component<Props> {

    render() {
        return (
            <Epost kontaktinformasjonReducer={this.props.kontaktinformasjon} />
        );
    }
}
const mapStateToProps = (state: AppState) => {
    return ({
        kontaktinformasjon: state.kontaktinformasjon
    });
};

export default connect(mapStateToProps, null)(MobiltelefonContainer);
