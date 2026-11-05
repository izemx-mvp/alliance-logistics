import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { site } from "@/config/site";
import { posts } from "@/data/posts";
import { SERVICE_SLUGS } from "@/data/services";

const sitemap = readFileSync(path.resolve(__dirname, "../../public/sitemap.xml"), "utf-8");

describe("public/sitemap.xml", () => {
  it.each([
    ...SERVICE_SLUGS.map((s) => `/services/${s}`),
    ...posts.map((p) => `/actualites/${p.slug}`),
    "/reseau",
    "/cotation",
    "/contact",
  ])("lists %s in FR and EN", (p) => {
    expect(sitemap).toContain(`<loc>${site.url}${p}</loc>`);
    expect(sitemap).toContain(`<loc>${site.url}${p}?lang=en</loc>`);
  });

  it("does not index the client area", () => {
    expect(sitemap).not.toContain("/espace-client");
  });
});
