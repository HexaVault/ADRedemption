import { DC } from "../../constants";
import { Currency } from "../../currency";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.mending.warpRebuyables[props.id],
    1e30,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect, effectType } = props;
  props.effect = () =>{ 
    if (props.effectType === "+" || props.effectType === "-" || props.effectType === "×1e" ){
      return effect * player.mending.warpRebuyables[props.id];
    }
    return Math.pow(effect, player.mending.warpRebuyables[props.id]);
  };
  props.description = () => props.textTemplate.replace("{value}",formatInt(effect));
  if (!props.noEffect) {
    props.formatEffect = value => effectType + format(value, 2, 0);
    if(props.id==3) props.formatEffect = value => effectType + format(value, 3, 3);
    props.formatCost = value => format(value, 2, 0);
  }
  return props;
};


export const warpUpgrades = [
  rebuyable({
    name: "More Infinite Power",
    id: 1,
    initialCost: 1e30,
    costMult: 1e5,
    textTemplate: "Increase Infinite Power softcap's Thereshold by ×1e2.5e14",
    effect: 2.5e14,
    effectType: "×1e"
  }),
  rebuyable({
    name: "Memory Gain",
    id: 2,
    initialCost: 1e20,
    costMult: 100,
    textTemplate: "Improve Ra's memory gain by ×3",
    effect: 3,
    effectType: "×"
  }),
  rebuyable({
    name: "Game speed softcap",
    id: 3,
    initialCost: 1e20,
    costMult: 100,
    textTemplate: "Increase Game speed's softcap by 0.002",
    effect: 0.002,
    effectType: "+"
  }),
  {
    name: "Visible Galaxies",
    id: 4,
    cost: 1e55,
    requirement: "Reach 913579 total Galaxies in V's Superhard Reality.",
    hasFailed: () => !V.isSuperRunning,
    checkRequirement: () => V.isSuperRunning && Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies>=913579,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Obscure galaxy polynomial level -${formatInt(1)}`,
  },
  {
    name: "The Dedicated Way",
    id: 5,
    cost: 1e24,
    requirement: "Reach 1e2.450e18 Antimatter in Ra's Reality",
    hasFailed: () => !Ra.isRunning,
    checkRequirement: () => Ra.isRunning && Currency.antimatter.exponent>=2.45e18,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Ra's basic Memory chunk gain multiplier based on current Antimatter`,
    effect: () => Math.max(Math.log10(Currency.antimatter.exponent),1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Hostility+",
    id: 6,
    cost: 1e300,
    requirement: "Mend with a total hostility level of atleast 60",
    hasFailed: () => !player.mending.corruptionChallenge.corruptedMend || !player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 60,
    checkRequirement: () => player.mending.corruptionChallenge.corruptedMend && player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 60,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Hostility caps +${formatInt(1)}`,
  },
  {
    name: "Warp Upgrade 7",
    id: 7,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 8",
    id: 8,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 9",
    id: 9,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Boost Readjustment",
    id: 10,
    cost: 1e300,
    requirement: () => `Reach ${format(5e9)} dimension boosts without having enabled continuum this Reality.`,
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Dimension boost scaling occurs ${formatX(20)} later`,
  },
  {
    name: "Noticeable Galaxies",
    id: 11,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Obscure galaxy polynomial level -${formatInt(1)}`,
  },
  {
    name: "Hostility++",
    id: 12,
    cost: 1e300,
    requirement: "Mend with a total hostility level of atleast 80",
    hasFailed: () => !player.mending.corruptionChallenge.corruptedMend || !player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 80,
    checkRequirement: () => player.mending.corruptionChallenge.corruptedMend && player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 80,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Hostility caps +${formatInt(1)}`,
  },
  /*
  {
    name: "Warp Upgrade 13",
    id: 13,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 14",
    id: 14,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Hostility+",
    id: 15,
    cost: 1e300,
    requirement: "Mend with an average corruption level of 6 or higher",
    hasFailed: () => !player.mending.corruptionChallenge.corruptedMend || !player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 6,
    checkRequirement: () => player.mending.corruptionChallenge.corruptedMend && player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 6,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Hostility caps +${formatInt(1)}`,
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 16",
    id: 16,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 17",
    id: 17,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 18",
    id: 18,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 19",
    id: 19,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 20",
    id: 20,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 21",
    id: 21,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 22",
    id: 22,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Warp Upgrade 23",
    id: 23,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: "[TBD]",
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Noticeable Galaxies",
    id: 24,
    cost: 1e300,
    requirement: "Wait 5 Hours [NYI]",
    hasFailed: () => false,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Obscure galaxy polynomial level -${formatInt(1)}`,
  },
  {
    name: "Hostility++",
    id: 25,
    cost: 1e300,
    requirement: "Mend with an average corruption level of 8 or higher",
    hasFailed: () => !player.mending.corruptionChallenge.corruptedMend || !player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 8,
    checkRequirement: () => player.mending.corruptionChallenge.corruptedMend && player.mending.corruption.reduce((partialSum, a) => partialSum + a, 0) >= 8,
    checkEvent: GAME_EVENT.MENDING_RESET_BEFORE,
    canLock: false,
    lockEvent: "gain a Replicanti Galaxy",
    description: () => `Hostility caps +${formatInt(1)}`,
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 2)
  }, */
];
