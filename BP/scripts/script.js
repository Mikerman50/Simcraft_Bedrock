import { world, BlockLocation, EntityQueryOptions, EntityType } from 'minecraft-server';
import { BlockTypes, BlockPermutation, BlockPistonComponent } from 'minecraft-server-admin';

// --- Configuration ---
const CONVEYOR_BLOCK_TYPE_ID = "bridge:blockGardenPot_15"; // Unique ID for your block
const CONVEYOR_SPEED = 0.1; // Adjust the speed of the conveyor (units per tick)
const CONVEYOR_DIRECTION = { x: 1, y: 0, z: 0 }; // Direction items will move (e.g., +X axis)
const CHECK_INTERVAL_TICKS = 4; // How often to check for items (e.g., every 4 ticks)

// --- Block Registration (Ideally done in JSON - but can be done in script for simple example) ---
// In a real mod, you'd define the block's appearance and properties in JSON files
// For this example, we'll just assume it's registered and has a basic appearance.
// You'd typically have a block definition JSON in `behavior_packs/your_mod/blocks/`

// --- Script Logic ---
let tickCounter = 0;

world.events.tick.subscribe(() => {
    tickCounter++;
    if (tickCounter % CHECK_INTERVAL_TICKS !== 0) {
        return; // Only run the logic at intervals
    }

    // 1. Iterate through loaded chunks (or a specific area - optimization needed for large areas)
    for (const player of world.getPlayers()) { // A simple way to get loaded chunks around players
        const playerLocation = player.location;
        const searchRadius = 32; // Adjust radius as needed for performance

        for (let x = Math.floor(playerLocation.x - searchRadius); x <= Math.floor(playerLocation.x + searchRadius); x++) {
            for (let y = Math.floor(playerLocation.y - searchRadius); y <= Math.floor(playerLocation.y + searchRadius); y++) {
                for (let z = Math.floor(playerLocation.z - searchRadius); z <= Math.floor(playerLocation.z + searchRadius); z++) {
                    const blockLocation = new BlockLocation(x, y, z);
                    const block = player.dimension.getBlock(blockLocation);

                    if (block && block.typeId === CONVEYOR_BLOCK_TYPE_ID) {
                        // 2. Found a conveyor block! Check for items above it
                        const itemSearchLocation = blockLocation.offset(0, 1, 0); // Check block directly above
                        const queryOptions = new EntityQueryOptions();
                        queryOptions.location = itemSearchLocation;
                        queryOptions.maxDistance = 0.5; // Small radius to only get items directly on top
                        queryOptions.entityTypes = [EntityType.ITEM]; // Only target dropped items

                        const itemsAbove = player.dimension.getEntities(queryOptions);

                        // 3. Move items forward
                        for (const itemEntity of itemsAbove) {
                            // Apply impulse to move the item
                            itemEntity.applyImpulse(
                                {
                                    x: CONVEYOR_DIRECTION.x * CONVEYOR_SPEED,
                                    y: CONVEYOR_DIRECTION.y * CONVEYOR_SPEED,
                                    z: CONVEYOR_DIRECTION.z * CONVEYOR_SPEED
                                }
                            );
                        }
                    }
                }
            }
        }
    }
});

console.log("Conveyor block script initialized!");