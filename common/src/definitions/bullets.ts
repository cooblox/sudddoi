import { BaseBulletDefinition } from "../utils/baseBullet";
import { DefinitionType, ObjectDefinitions, type ObjectDefinition } from "../utils/objectDefinitions";
import { Explosions } from "./explosions";
import { Guns } from "./items/guns";

export type BulletDefinition = BaseBulletDefinition & ObjectDefinition & {
    readonly defType: DefinitionType.Bullet
};

const bulletColors: Record<string, number> = {
    "9mm": 0xffff80,
    "12g": 0xffc8c8,
    "556mm": 0x80ff80,
    "762mm": 0x80ffff,
    "50cal": 0x202020,
    "338lap": 0x408000,
    "bb": 0xaaaaaa,
    "shrapnel": 0x1d1d1d
};

const saturatedBulletColors: Record<string, number> = {
    "9mm": 0xffea00,
    "12g": 0xf53d3d,
    "556mm": 0x00e700,
    "762mm": 0x004dff,
    "50cal": 0x545454,
    "338lap": 0x92d211,
    "bb": 0xeeeeee,
    "shrapnel": 0x363636
};

export const Bullets = new ObjectDefinitions<BulletDefinition>(
    [
        ...Guns.definitions,
        ...Explosions.definitions
    ]
        .filter(def => !("isDual" in def) || !def.isDual)
        .map(def => {
            let color = def.ballistics.tracer?.color;
            let saturatedColor = def.ballistics.tracer?.saturatedColor;

            // if this bullet definition doesn't override the tracer color
            // calculate it based on ammo type or if it's shrapnel
            if (color === undefined) {
                if (def.defType === DefinitionType.Gun && def.ammoType in bulletColors) {
                    color = bulletColors[def.ammoType];
                    saturatedColor ??= saturatedBulletColors[def.ammoType];
                } else if (def.ballistics.shrapnel) {
                    color = bulletColors.shrapnel;
                    saturatedColor = saturatedBulletColors.shrapnel;
                }
            }

            return {
                idString: `${def.idString}_bullet`,
                name: `${def.name} Bullet`,
                defType: DefinitionType.Bullet,
                ...def.ballistics,
                tracer: {
                    color: color ?? 0xffffff,
                    saturatedColor: saturatedColor ?? 0xffffff,
                    ...def.ballistics.tracer
                }
            };
        })
);
