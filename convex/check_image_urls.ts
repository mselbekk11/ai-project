import { query } from "./_generated/server";

// Query to check what image URLs are actually in the database
export const checkAllImageUrls = query({
  handler: async (ctx) => {
    // Get sample URLs from each table
    const headshotModels = await ctx.db.query("headshot_models").take(5);
    const clothingItems = await ctx.db.query("clothing_items").take(5);
    const generations = await ctx.db.query("generations").take(5);
    
    const sampleUrls = {
      headshot_models: headshotModels.map(model => ({
        id: model._id,
        name: model.name,
        status: model.status,
        sample_images: model.images.slice(0, 2) // Just first 2 URLs
      })),
      clothing_items: clothingItems.map(item => ({
        id: item._id,
        image_url: item.image_url,
        status: item.status
      })),
      generations: generations.map(gen => ({
        id: gen._id,
        image_url_generation: gen.image_url_generation,
        image_url: gen.image_url,
        created_at: gen.created_at
      }))
    };
    
    // Count total records
    const totalCounts = {
      headshot_models: headshotModels.length,
      clothing_items: clothingItems.length,
      generations: generations.length
    };
    
    return {
      sampleUrls,
      totalCounts,
      message: "Sample URLs from your database"
    };
  },
});

// Query to specifically look for broken S3 URLs
export const findBrokenS3Urls = query({
  handler: async (ctx) => {
    const brokenDomain = "sdbooth2-production.s3.amazonaws.com";
    
    // Check all tables for the old domain
    const headshotModels = await ctx.db.query("headshot_models").collect();
    const clothingItems = await ctx.db.query("clothing_items").collect();
    const generations = await ctx.db.query("generations").collect();
    
    const brokenHeadshotModels = headshotModels.filter(model => 
      model.images.some(imageUrl => imageUrl.includes(brokenDomain))
    );
    
    const brokenClothingItems = clothingItems.filter(item => 
      item.image_url.includes(brokenDomain)
    );
    
    const brokenGenerations = generations.filter(gen => 
      gen.image_url_generation.includes(brokenDomain) || 
      gen.image_url.includes(brokenDomain)
    );
    
    return {
      broken_records: {
        headshot_models: brokenHeadshotModels.length,
        clothing_items: brokenClothingItems.length,
        generations: brokenGenerations.length
      },
      sample_broken_urls: {
        headshot_models: brokenHeadshotModels.slice(0, 3).map(model => ({
          id: model._id,
          name: model.name,
          broken_images: model.images.filter(url => url.includes(brokenDomain))
        })),
        clothing_items: brokenClothingItems.slice(0, 3).map(item => ({
          id: item._id,
          broken_url: item.image_url
        })),
        generations: brokenGenerations.slice(0, 3).map(gen => ({
          id: gen._id,
          broken_generation_url: gen.image_url_generation.includes(brokenDomain) ? gen.image_url_generation : null,
          broken_reference_url: gen.image_url.includes(brokenDomain) ? gen.image_url : null
        }))
      },
      total_broken: brokenHeadshotModels.length + brokenClothingItems.length + brokenGenerations.length
    };
  },
});