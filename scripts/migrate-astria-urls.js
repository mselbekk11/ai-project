#!/usr/bin/env node

/**
 * Astria URL Migration Script
 * 
 * This script helps migrate Astria image URLs from the old S3 format
 * to the new Cloudflare R2 format in your Convex database.
 * 
 * Usage:
 * 1. First check what needs migration: node scripts/migrate-astria-urls.js --check
 * 2. Run the migration: node scripts/migrate-astria-urls.js --migrate
 * 3. Verify migration: node scripts/migrate-astria-urls.js --verify
 */

const { ConvexHttpClient } = require("convex/browser");

// Get Convex URL from environment or .env.local
const fs = require('fs');
let convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/);
    if (match) {
      convexUrl = match[1].trim();
    }
  } catch (error) {
    // Fallback - will show error below
  }
}

const convex = new ConvexHttpClient(convexUrl);

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("🔗 Astria URL Migration Tool");
  console.log("============================");

  if (!convexUrl) {
    console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment variables or .env.local");
    process.exit(1);
  }

  try {
    switch (command) {
      case '--check':
        await checkMigrationNeeds();
        break;
      case '--migrate':
        await runMigration();
        break;
      case '--verify':
        await verifyMigration();
        break;
      default:
        showUsage();
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

async function checkMigrationNeeds() {
  console.log("🔍 Checking how many records need migration...\n");
  
  const counts = await convex.query("migrate_astria_urls:countRecordsNeedingMigration");
  
  console.log("Records needing migration:");
  console.log(`📸 Headshot Models: ${counts.headshot_models}`);
  console.log(`👕 Clothing Items: ${counts.clothing_items}`);
  console.log(`🎨 Generations: ${counts.generations}`);
  console.log(`📊 Total: ${counts.total}`);
  
  if (counts.total === 0) {
    console.log("\n✅ No records need migration!");
  } else {
    console.log(`\n⚠️  ${counts.total} records need to be migrated`);
    console.log("\nTo proceed with migration, run:");
    console.log("node scripts/migrate-astria-urls.js --migrate");
  }
}

async function runMigration() {
  console.log("🚀 Starting Astria URL migration...\n");
  
  // First check what needs migration
  const counts = await convex.query("migrate_astria_urls:countRecordsNeedingMigration");
  
  if (counts.total === 0) {
    console.log("✅ No records need migration!");
    return;
  }
  
  console.log(`Found ${counts.total} records to migrate`);
  console.log("Starting migration...\n");
  
  // Run the complete migration
  const result = await convex.mutation("migrate_astria_urls:runCompleteAstriaMigration");
  
  console.log("✅ Migration completed successfully!");
  console.log(`📊 Total records migrated: ${result.totalMigrated}`);
  console.log("Details:");
  console.log(`  - Headshot Models: ${result.details.headshot_models}`);
  console.log(`  - Clothing Items: ${result.details.clothing_items}`);
  console.log(`  - Generations: ${result.details.generations}`);
  
  console.log("\nTo verify the migration was successful, run:");
  console.log("node scripts/migrate-astria-urls.js --verify");
}

async function verifyMigration() {
  console.log("🔍 Verifying migration results...\n");
  
  const verification = await convex.query("migrate_astria_urls:verifyMigration");
  
  if (verification.migration_complete) {
    console.log("✅ Migration verification PASSED!");
    console.log("All records have been successfully migrated to the new Astria URLs.");
  } else {
    console.log("❌ Migration verification FAILED!");
    console.log("Some records still have old URLs:");
  }
  
  console.log("\nRemaining old URLs:");
  console.log(`📸 Headshot Models: ${verification.remaining_old_urls.headshot_models}`);
  console.log(`👕 Clothing Items: ${verification.remaining_old_urls.clothing_items}`);
  console.log(`🎨 Generations: ${verification.remaining_old_urls.generations}`);
  
  console.log("\nMigrated to new URLs:");
  console.log(`📸 Headshot Models: ${verification.migrated_to_new_urls.headshot_models}`);
  console.log(`👕 Clothing Items: ${verification.migrated_to_new_urls.clothing_items}`);
  console.log(`🎨 Generations: ${verification.migrated_to_new_urls.generations}`);
}

function showUsage() {
  console.log("Usage: node scripts/migrate-astria-urls.js [command]");
  console.log("\nCommands:");
  console.log("  --check    Check how many records need migration");
  console.log("  --migrate  Run the complete migration");
  console.log("  --verify   Verify migration was successful");
  console.log("\nExample workflow:");
  console.log("  1. node scripts/migrate-astria-urls.js --check");
  console.log("  2. node scripts/migrate-astria-urls.js --migrate");
  console.log("  3. node scripts/migrate-astria-urls.js --verify");
}

main();