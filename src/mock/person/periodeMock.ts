import { Periode } from '../../models/tid';
import { getSistOppdatert } from '../utils/mock-utils';
import { backendDatoformat } from '../../utils/date-utils';

export function getPeriode(): Periode {
    return {
        fra: getSistOppdatert(),
        til: getSistOppdatert()
    };
}

export function getPeriodeRange(faker: Faker.FakerStatic, years: number): Periode {
    return {
        fra: backendDatoformat(faker.date.past(years)),
        til: backendDatoformat(faker.date.past(years))
    };
}
