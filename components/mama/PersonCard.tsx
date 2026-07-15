"use client";

import type { PublicPerson } from "@/lib/types";
import BigCard from "./BigCard";
import WhatsAppButton from "./WhatsAppButton";

type PersonCardProps<T extends PublicPerson> = {
  person: T;
  onTap: (person: T) => void;
  showWhatsApp?: boolean;
};

export default function PersonCard<T extends PublicPerson>({
  person,
  onTap,
  showWhatsApp = false,
}: PersonCardProps<T>) {
  return (
    <BigCard label={person.name} photoUrl={person.photo_url} onTap={() => onTap(person)}>
      {showWhatsApp && person.phone_number ? (
        <WhatsAppButton phoneNumber={person.phone_number} />
      ) : null}
    </BigCard>
  );
}
