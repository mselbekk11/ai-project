import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to migrate a single URL
function migrateUrl(url: string): string {
  if (url.includes("sdbooth2-production.s3.amazonaws.com")) {
    return url.replace(
      "https://sdbooth2-production.s3.amazonaws.com/",
      "https://mp.astria.ai/"
    );
  }
  return url;
}

// Query to count records that need migration
export const countRecordsNeedingMigration = query({
  handler: async (ctx) => {
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    
    // Count headshot_models that need migration
    const headshotModels = await ctx.db.query("headshot_models").collect();
    const headshotModelsNeedingMigration = headshotModels.filter(model => 
      model.images.some(imageUrl => imageUrl.includes(oldDomain))
    );
    
    // Count clothing_items that need migration
    const clothingItems = await ctx.db.query("clothing_items").collect();
    const clothingItemsNeedingMigration = clothingItems.filter(item => 
      item.image_url.includes(oldDomain)
    );
    
    // Count generations that need migration
    const generations = await ctx.db.query("generations").collect();
    const generationsNeedingMigration = generations.filter(gen => 
      gen.image_url_generation.includes(oldDomain) || 
      gen.image_url.includes(oldDomain)
    );
    
    return {
      headshot_models: headshotModelsNeedingMigration.length,
      clothing_items: clothingItemsNeedingMigration.length,
      generations: generationsNeedingMigration.length,
      total: headshotModelsNeedingMigration.length + 
             clothingItemsNeedingMigration.length + 
             generationsNeedingMigration.length
    };
  },
});

// Migration function for headshot_models
export const migrateHeadshotModels = mutation({
  handler: async (ctx) => {
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    const models = await ctx.db.query("headshot_models").collect();
    
    let migratedCount = 0;
    
    for (const model of models) {
      const needsMigration = model.images.some(imageUrl => imageUrl.includes(oldDomain));
      
      if (needsMigration) {
        const migratedImages = model.images.map(migrateUrl);
        
        await ctx.db.patch(model._id, {
          images: migratedImages
        });
        
        migratedCount++;
      }
    }
    
    return { migratedCount, message: `Migrated ${migratedCount} headshot models` };
  },
});

// Migration function for clothing_items
export const migrateClothingItems = mutation({
  handler: async (ctx) => {
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    const items = await ctx.db.query("clothing_items").collect();
    
    let migratedCount = 0;
    
    for (const item of items) {
      if (item.image_url.includes(oldDomain)) {
        const migratedUrl = migrateUrl(item.image_url);
        
        await ctx.db.patch(item._id, {
          image_url: migratedUrl
        });
        
        migratedCount++;
      }
    }
    
    return { migratedCount, message: `Migrated ${migratedCount} clothing items` };
  },
});

// Migration function for generations
export const migrateGenerations = mutation({
  handler: async (ctx) => {
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    const generations = await ctx.db.query("generations").collect();
    
    let migratedCount = 0;
    
    for (const generation of generations) {
      const needsMigration = 
        generation.image_url_generation.includes(oldDomain) ||
        generation.image_url.includes(oldDomain);
      
      if (needsMigration) {
        const updates: any = {};
        
        if (generation.image_url_generation.includes(oldDomain)) {
          updates.image_url_generation = migrateUrl(generation.image_url_generation);
        }
        
        if (generation.image_url.includes(oldDomain)) {
          updates.image_url = migrateUrl(generation.image_url);
        }
        
        await ctx.db.patch(generation._id, updates);
        migratedCount++;
      }
    }
    
    return { migratedCount, message: `Migrated ${migratedCount} generations` };
  },
});

// Complete migration function that runs all migrations
export const runCompleteAstriaMigration = mutation({
  handler: async (ctx) => {
    console.log("Starting complete Astria URL migration...");
    
    // Run migrations directly instead of using runMutation
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    
    // Migrate headshot models
    const headshotModels = await ctx.db.query("headshot_models").collect();
    let headshotMigratedCount = 0;
    
    for (const model of headshotModels) {
      const needsMigration = model.images.some(imageUrl => imageUrl.includes(oldDomain));
      
      if (needsMigration) {
        const migratedImages = model.images.map(url => 
          url.includes(oldDomain) 
            ? url.replace("https://sdbooth2-production.s3.amazonaws.com/", "https://mp.astria.ai/")
            : url
        );
        
        await ctx.db.patch(model._id, {
          images: migratedImages
        });
        
        headshotMigratedCount++;
      }
    }
    
    // Migrate clothing items
    const clothingItems = await ctx.db.query("clothing_items").collect();
    let clothingMigratedCount = 0;
    
    for (const item of clothingItems) {
      if (item.image_url.includes(oldDomain)) {
        const migratedUrl = item.image_url.replace(
          "https://sdbooth2-production.s3.amazonaws.com/", 
          "https://mp.astria.ai/"
        );
        
        await ctx.db.patch(item._id, {
          image_url: migratedUrl
        });
        
        clothingMigratedCount++;
      }
    }
    
    // Migrate generations
    const generations = await ctx.db.query("generations").collect();
    let generationsMigratedCount = 0;
    
    for (const generation of generations) {
      const needsMigration = 
        generation.image_url_generation.includes(oldDomain) ||
        generation.image_url.includes(oldDomain);
      
      if (needsMigration) {
        const updates: any = {};
        
        if (generation.image_url_generation.includes(oldDomain)) {
          updates.image_url_generation = generation.image_url_generation.replace(
            "https://sdbooth2-production.s3.amazonaws.com/", 
            "https://mp.astria.ai/"
          );
        }
        
        if (generation.image_url.includes(oldDomain)) {
          updates.image_url = generation.image_url.replace(
            "https://sdbooth2-production.s3.amazonaws.com/", 
            "https://mp.astria.ai/"
          );
        }
        
        await ctx.db.patch(generation._id, updates);
        generationsMigratedCount++;
      }
    }
    
    const totalMigrated = headshotMigratedCount + clothingMigratedCount + generationsMigratedCount;
    
    return {
      success: true,
      totalMigrated,
      details: {
        headshot_models: headshotMigratedCount,
        clothing_items: clothingMigratedCount,
        generations: generationsMigratedCount
      },
      message: `Migration complete! Updated ${totalMigrated} records total.`
    };
  },
});

// Query to verify migration was successful
export const verifyMigration = query({
  handler: async (ctx) => {
    const oldDomain = "sdbooth2-production.s3.amazonaws.com";
    const newDomain = "mp.astria.ai";
    
    // Check for any remaining old URLs
    const headshotModels = await ctx.db.query("headshot_models").collect();
    const remainingHeadshotModels = headshotModels.filter(model => 
      model.images.some(imageUrl => imageUrl.includes(oldDomain))
    );
    
    const clothingItems = await ctx.db.query("clothing_items").collect();
    const remainingClothingItems = clothingItems.filter(item => 
      item.image_url.includes(oldDomain)
    );
    
    const generations = await ctx.db.query("generations").collect();
    const remainingGenerations = generations.filter(gen => 
      gen.image_url_generation.includes(oldDomain) || 
      gen.image_url.includes(oldDomain)
    );
    
    // Count new URLs
    const migratedHeadshotModels = headshotModels.filter(model => 
      model.images.some(imageUrl => imageUrl.includes(newDomain))
    );
    
    const migratedClothingItems = clothingItems.filter(item => 
      item.image_url.includes(newDomain)
    );
    
    const migratedGenerations = generations.filter(gen => 
      gen.image_url_generation.includes(newDomain) || 
      gen.image_url.includes(newDomain)
    );
    
    return {
      migration_complete: 
        remainingHeadshotModels.length === 0 && 
        remainingClothingItems.length === 0 && 
        remainingGenerations.length === 0,
      remaining_old_urls: {
        headshot_models: remainingHeadshotModels.length,
        clothing_items: remainingClothingItems.length,
        generations: remainingGenerations.length
      },
      migrated_to_new_urls: {
        headshot_models: migratedHeadshotModels.length,
        clothing_items: migratedClothingItems.length,
        generations: migratedGenerations.length
      }
    };
  },
});