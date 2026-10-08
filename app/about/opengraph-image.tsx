import { socialImage } from "@/components/work/SocialImage";

export const alt = "About Mohit Agarwal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return socialImage({ title: "Behind the projects.", description: "Mathematics & Computing at IIT Roorkee. Software, open source and competitive programming.", label: "Crew profile · Lunar orbit" });
}
