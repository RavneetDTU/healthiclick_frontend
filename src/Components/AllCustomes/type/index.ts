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
  
  export interface Followup {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatarImage: Image;
    status: Status;
  }
  