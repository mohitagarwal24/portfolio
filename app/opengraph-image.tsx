import { socialImage } from "@/components/work/SocialImage";
import { profile } from "@/content/profile";
import { siteConfig } from "@/site.config";

export const alt = "Mohit Agarwal · Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return socialImage({ title: siteConfig.name, description: profile.tagline.join(" "), label: "Mission Ascent" });
}
