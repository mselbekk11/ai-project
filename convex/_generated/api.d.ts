/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as check_image_urls from "../check_image_urls.js";
import type * as clothing_items from "../clothing_items.js";
import type * as credits from "../credits.js";
import type * as generations from "../generations.js";
import type * as headshot_models from "../headshot_models.js";
import type * as migrate_astria_urls from "../migrate_astria_urls.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  check_image_urls: typeof check_image_urls;
  clothing_items: typeof clothing_items;
  credits: typeof credits;
  generations: typeof generations;
  headshot_models: typeof headshot_models;
  migrate_astria_urls: typeof migrate_astria_urls;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
