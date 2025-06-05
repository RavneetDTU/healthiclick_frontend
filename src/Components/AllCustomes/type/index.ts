// types/index.ts

import { StaticImageData } from "next/image";

export interface Image {
  url: string | StaticImageData;
  alt?: string;
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Blocked = "blocked",
}

export interface BaseUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarImage: Image;
  [key: string]: unknown;
}

export interface Followup extends BaseUser {
  status: Status;
}

export interface SessionUser extends BaseUser {
  sessionStatus: "Expiring Soon" | "Active" | "Expired";
}
