import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class UmbreonV extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = "DEFENDING_POKEMON_CANNOT_RETREAT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
