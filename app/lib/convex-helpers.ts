/**
 * Helper utilities for working with Convex
 */

import { FunctionReference } from "convex/server";

/**
 * Helper function to cast a Convex API path to a query function reference
 */
export function asQuery<T = any>(apiPath: any): FunctionReference<"query", "public", any, T> {
  return apiPath as unknown as FunctionReference<"query", "public", any, T>;
}

/**
 * Helper function to cast a Convex API path to a mutation function reference
 */
export function asMutation<T = any>(apiPath: any): FunctionReference<"mutation", "public", any, T> {
  return apiPath as unknown as FunctionReference<"mutation", "public", any, T>;
}

/**
 * Helper function to cast a Convex API path to an action function reference
 */
export function asAction<T = any>(apiPath: any): FunctionReference<"action", "public", any, T> {
  return apiPath as unknown as FunctionReference<"action", "public", any, T>;
} 