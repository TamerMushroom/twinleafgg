import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
export declare class DarknessEnergy extends EnergyCard {
    provides: CardType[];
    set: string;
    name: string;
    fullName: string;
}
