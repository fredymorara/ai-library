"use client";

import { CreateOrganization } from "@clerk/nextjs";

export default function OrganizationSetupPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <CreateOrganization />
    </div>
  );
}
