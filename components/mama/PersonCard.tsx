"use client";

import type { PublicPerson } from "@/lib/types";
import BigCard from "./BigCard";
import CallButton from "./CallButton";

type PersonCardProps<T extends PublicPerson> = {
  person: T;
  onTap: (person: T) => void;
  showCallButton?: boolean;
};

export default function PersonCard<T extends PublicPerson>({
  person,
  onTap,
  showCallButton = false,
}: PersonCardProps<T>) {
  return (
    <BigCard label={person.name} photoUrl={person.photo_url} onTap={() => onTap(person)}>
      {showCallButton && person.phone_number ? (
        <CallButton phoneNumber={person.phone_number} />
      ) : null}
    </BigCard>
  );
}
