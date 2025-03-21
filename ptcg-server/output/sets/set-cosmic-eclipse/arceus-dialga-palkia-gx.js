"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusDialgaPalkiaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useUltimateRay(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3 }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class ArceusDialgaPalkiaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.TAG_TEAM];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ultimate Ray',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Altered Creation GX',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'For the rest of this game, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). If this Pokémon has at least 1 extra Water Energy attached to it (in addition to this attack\'s cost), when your opponent\'s Active Pokémon is Knocked Out by damage from those attacks, take 1 more Prize card. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CEC';
        this.name = 'Arceus & Dialga & Palkia GX';
        this.fullName = 'Arceus & Dialga & Palkia GX CEC';
        this.setNumber = '156';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useUltimateRay(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used altered creation
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            player.alteredCreationDamage = true;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Check if there's any Water energy attached
            const hasWaterEnergy = checkEnergy.energyMap.some(e => e.provides.includes(card_types_1.CardType.WATER));
            if (hasWaterEnergy) {
                player.usedAlteredCreation == true;
                console.log('Used Altered Creation with Extra Water');
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            // const opponent = StateUtils.getOpponent(state, player);
            if (player.alteredCreationDamage === true) {
                effect.damage += 30;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Amp You Very Much"
            if (player.usedAlteredCreation === true) {
                effect.prizeCount += 1;
            }
        }
        // if (effect instanceof PutDamageEffect && effect.source == effect.player.active) {
        //   const player = effect.player;
        //   const opponent = StateUtils.getOpponent(state, effect.player);
        //   if (effect.target == effect.source) {
        //     return state;
        //   }
        //   if (effect.target !== player.active && effect.target !== opponent.active) {
        //     return state;
        //   }
        //   if (effect.damageReduced) {
        //     // Damage already reduced, don't reduce again
        //     return state;
        //   }
        //   const targetCard = effect.target.getPokemonCard();
        //   if (targetCard && player.alteredCreationDamage) {
        //     effect.damage += 30;
        //     effect.damageReduced = true;
        //   }
        // }
        return state;
    }
}
exports.ArceusDialgaPalkiaGX = ArceusDialgaPalkiaGX;
