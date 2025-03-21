import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
export declare class Postwick extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    name: string;
    fullName: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
