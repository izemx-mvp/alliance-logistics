import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { posts } from "@/data/posts";
import { SERVICE_SLUGS } from "@/data/services";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

const STATIC_PAGES = [
  "/",
  "/a-propos",
  "/services",
  "/reseau",
  "/cotation",
  "/suivi",
  "/espace-client",
  "/espace-client/dossiers",
  "/actualites",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

describe("App routing", () => {
  it.each([
    ...STATIC_PAGES,
    ...SERVICE_SLUGS.map((s) => `/services/${s}`),
    ...posts.map((p) => `/actualites/${p.slug}`),
  ])("matches a page for %s instead of falling back to not found", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("has exactly 6 services and 4 articles", () => {
    expect(SERVICE_SLUGS).toHaveLength(6);
    expect(posts).toHaveLength(4);
  });
});
