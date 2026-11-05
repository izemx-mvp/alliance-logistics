import { FileCheck2, Scale, Ship, Snowflake } from "lucide-react";
import type { PostCategory } from "@/data/posts";

/** Icon for each blog category (news list, article hero). */
export const CATEGORY_ICON: Record<PostCategory, typeof Ship> = {
  incoterms: Scale,
  douane: FileCheck2,
  "chaine-du-froid": Snowflake,
  maritime: Ship,
};