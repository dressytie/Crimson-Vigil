# Crimson Vigil — latest approved systems recovery audit
Updated 2026-11-07. This is an audit and integration specification, NOT proof of completed restoration.

## Release rule
No wholesale checkout, no revert of the game to a previous commit, no unreviewed merge to main. Start from current main, cherry-pick/reimplement *individual features* based on most recent user approval, and validate both visuals and behavior in a Netlify deploy preview. Preserve previous approved behavior whenever new implementation conflicts. Never deploy a PR automatically to production.

## Repository baseline
main c9e6d20fe1 (at audit start). Main contains ghoul GLB and current cavern/weapon work but its Gore Whip sweep and imported ghoul ragdoll have regressed.

## Source of truth by system
| System | Current evidence / candidate source | Recovery action |
| --- | --- | --- |
| Gore Whip visual | main contains 2026-11-06 f95fc99f7 and 836c9e838 updates; work/enemy-model-overhaul PR #5 contains newer 180-degree forward and level-10 360-degree sweep; work/global-gore-whip-fluid PR #6 contains older alternative sweep | Preserve latest approved flexible glossy lash, windup, recoil, and precise forward 180-degree/level-10 360-degree behavior. Do not blindly replace entire weapon function. Confirm animation visual. |
| Blood | PR #5 and #6 are experimental liquid/fluid work, some user-requested reversions; main e0e11e5 is a later assistant restoration but not approved visually | Recover cohesive impact sheet and directional droplet behavior without FluidGPU, preserve High/Medium/Low/Off and death splatter with Off. Reject generic spray and earlier fluid performance regressions. |
| Original ragdoll dismemberment | work/global-gore-whip-fluid PR #6 has actual mesh sectioning with 15 anatomical regions / six sections; main e0e11e5 uses different rigs and imported ghoul sideways fall; PR #8 unverified anatomical prototype | Integrate 15-region, randomly sever 4–6 on each kill, original skinned visible mesh, full joint articulation, no duplicate chunk stand-ins; GLB skinned topology must be validated before claiming success. |
| Ghoul visual and walk | main cb53ee065, 820d757d; PR #12 distance-adaptive mixer update; PR #8 unverified locomotion edits | Keep approved V14 ghoul GLB and idle/walk/run/attack clips (overhead right-arm attack), do not substitute procedural model. Integrate safe animation throttling only after visual testing. |
| Floor 2/3 enemies | PR #9, PR #11 add gait/claws/geometry reuse and death fallback | Combine the latest compatible locomotion, keep original detailed bodies, verify 12 floor-specific types; no floating chunks. |
| Hunter/cape | main 0e75c2a725 approved hunter restoration | Keep exactly; no redesign. |
| Cavern/water/crystals | main contains latest Nov 6 cave/reflection/rock/obsidian/crystal commits | Keep exactly unless user explicitly requests change. |
| Progression/bosses/weapons | main contains Void Tide, weapon upgrade changes, Wraith Bow, Bloodthorn Flail, boss and UI refinements | Preserve current implementations; compare feature branches before selective edits. |
| Netlify | PR #13 infrastructure config, PR #12 preview confirmed; prior user asked automatic preview approval then merge to production | Test on preview first; main live only after visual approval. |
| Regression policy | PR #10 gameplay contract | Treat contract as mandatory. Add tests that assert walk animation actually advances and 4–6 *visible* skinned sections separate, rather than only checking a ragdoll object exists. |

## Explicit exclusions
- Do not reintroduce rejected blood simulation or generic red particle sprays.
- Do not interpret user-requested revert of one feature as permission to revert unrelated features.
- Do not replace approved ghouls with duplicate low-poly models or chunk geometry.
- Do not assert WebGPU renderer migrated: existing main still uses Three.js WebGLRenderer.
- Do not silently change Gore Whip range, damage, sweep, timing, or visual style while fixing blood.
- Do not merge PR #8 solely because it parses; it has not been verified against the GLB skeleton.

## Validation checklist
1. Side-by-side screenshots/video of player, Gore Whip at levels 1/3/10, ghoul walk/attack, 20 ghoul deaths, Floor 2/3 gait and death.
2. Count 4–6 actual detachable anatomical pieces per applicable corpse; original geometry/materials remain, no double meshes, independent physics/collisions.
3. Blood Off/Low/Medium/High visuals and performance under horde load.
4. Browser runtime and smoke tests; game menu, floors, bosses, progression, Windows and Netlify builds.
5. Preview deployed and approved before merging any gameplay change to main.

## Recovery work status
Audited repository history and known conversation requirements; **gameplay implementation and full visual testing remain outstanding**. This file is a guardrail for the integration, not a declaration of completion.
