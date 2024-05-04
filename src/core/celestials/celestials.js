import { MendingMilestone } from "../mending";
import { Destroyer } from "./destroyer";
import { Effarig } from "./effarig";
import { Enslaved } from "./enslaved";
import { Laitela } from "./laitela/laitela";
import { Pelle } from "./pelle/pelle";
import { Ra } from "./ra/ra";
import { Teresa } from "./teresa";
import { V } from "./V";
import { Kohler } from "./kohler";

export const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
  v: V,
  ra: Ra,
  laitela: Laitela,
  pelle: Pelle,
  destroyer: Destroyer,
  kohler: Kohler
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    effects() {
      return `Glyph Time Theorem generation is disabled.
      You gain less Infinity Points and Eternity Points (x^${format(0.55, 2, 2)}).`;
    },
  },
  {
    name: "Effarig",
    effects() {
      return `All Dimension multipliers, game speed, and tickspeed are severely lowered, like Dilation.
      Infinity Power reduces the production and game speed penalties and Time Shards reduce the tickspeed penalty.
      Glyph levels are temporarily capped to ${formatInt(Effarig.glyphLevelCap)}, rarity is unaffected.`;
    },
    description() {
      return `You will exit Effarig's Reality when you complete a Layer of it for the first time.`;
    }
  },
  {
    name: "The Nameless Ones",
    effects() {
      return `Glyph levels are boosted to a minimum of ${formatInt(5000)}.
      Infinity, Time, and 8th Antimatter Dimension purchases are limited to ${formatInt(1)} each.
      Antimatter Dimension multipliers are always Dilated (the Glyph effect still only applies in actual Dilation).
      Time Study 192 (uncapped Replicanti) is locked.
      The Black Hole is disabled.
      Tachyon Particle production and Dilated Time production are severely reduced.
      Time Theorem generation from Dilation Glyphs is disabled.
      Certain challenge goals are increased.
      Stored game time is discharged at a reduced effectiveness (exponent^${format(0.55, 2, 2)}).`;
    }
  },
  {
    name: "V",
    effects() {
      const vEffect = `All Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain\
      per second are square-rooted. 
      The Replicanti interval is squared.`;
      const vEffectAdditional = ` The Exponential Glyph Alchemy effect is disabled.`;

      let returnVal = vEffect
      if (Ra.unlocks.unlockGlyphAlchemy.canBeApplied) {
        returnVal += vEffectAdditional
      }
      return returnVal
    }
  },
  {
    name: "Ra",
    effects() {
      return `You only have ${formatInt(4)} Dimension Boosts and can not gain any more.
      The Tickspeed purchase multiplier is fixed at ${formatX(1.1245, 0, 3)}.`;
    },
  },
  {
    name: "Lai'tela",
    effects() {
      let disabledDims;
      const highestActive = 8 - Laitela.difficultyTier;
      switch (highestActive) {
        case 0:
          disabledDims = "all Dimensions";
          break;
        case 1:
          disabledDims = "2nd and higher Dimensions";
          break;
        case 2:
          disabledDims = "3rd and higher Dimensions";
          break;
        case 7:
          disabledDims = "8th Dimensions";
          break;
        default:
          disabledDims = `${highestActive + 1}th and higher Dimensions`;
          break;
      }
      const disabledText = highestActive === 8
        ? ""
        : `Production from ${disabledDims} is disabled.`;

      return `Infinity Point and Eternity Point gain are Dilated.
      Game speed is reduced to ${formatInt(1)} and gradually comes back over ${formatInt(10)} minutes.
      Black Hole storing, discharging, pulsing, and inversion are all disabled.
      ${disabledText}`;
    },
    description() {
      return `Antimatter generates entropy inside of this Reality.\
      At ${formatPercents(1)} entropy, the Reality becomes destabilized\
      and you gain a reward based on how quickly you reached ${formatPercents(1)}.
      Destabilizing the Reality in less than ${formatInt(30)} seconds makes it become significantly more difficult,\
      in exchange for giving a much stronger reward.\
      Doing this ${formatInt(8)} times will also give a ${formatX(8)} to Dark Energy gain.`;
    }
  },
  {
    name: "YOU SHOULDN'T LOOK THIS",
    effects() {
      const Effect = `This number 6 is dealt as a Error thrower when you enter Pelle through normal model.
      Do not use number 6.`;
      return Effect;
    }
  },
  {
    name: "SuperV",
    effects() {
      const vEffect = `All Dimension multipliers, Tickspeed, Eternity Point gain, Infinity Point gain, and Dilated Time gain\
      per second are ^(1 / ${format(1e6, 0, 0)}). 
      The Replicanti interval is 5^its origin.
      The Exponential Glyph Alchemy effect is disabled.`;
      return vEffect;
    }
  },
  {
    name: "Kohler",
    effects(){
      const x =`You are trapped in V's Reality, Teresa's Reality, and Eternity Challenge 5.\
      All Mending and Warp Upgrades are disabled.\
      You are trapped in Hostilities with levels [4, 4, 2, 4, 4, 4, 0, 4, 4, 4].\
      All Challenges and Celestial Realities are much harder.\
      Most costs are altered.`;
      return x;
    }
  }
];
