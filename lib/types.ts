// Forma expuesta por la vista `people_public`. A proposito NO incluye
// private_note/sensitive_note: ese campo no existe en la vista, asi que no
// hay forma de que se filtre a la app de mama ni siquiera por error.
export type PublicPerson = {
  id: string;
  name: string;
  photo_url: string | null;
  audio_url: string | null;
  relation: string | null;
  parent_id: string | null;
  phone_number: string | null;
  display_order: number;
};

// Arbol en memoria: roots = hijos directos de mama (parent_id null).
// childrenByParent permite navegar recursivamente, un nivel a la vez, sin
// importar la profundidad real del arbol (hijo -> nieto -> bisnieto -> ...).
export type FamilyTree = {
  roots: PublicPerson[];
  personById: Map<string, PublicPerson>;
  childrenByParent: Map<string, PublicPerson[]>;
};

// Fila completa de la tabla `people`, solo para el panel familiar
// (autenticado). Incluye is_active y private_note, que jamas llegan a
// PublicPerson/people_public.
export type AdminPerson = {
  id: string;
  name: string;
  photo_url: string | null;
  audio_url: string | null;
  relation: string | null;
  parent_id: string | null;
  phone_number: string | null;
  is_active: boolean;
  private_note: string | null;
  display_order: number;
};

export type AdminPersonInput = Omit<AdminPerson, "id" | "display_order"> & {
  display_order?: number;
};

export type MediaType = "photo" | "video";

// Forma expuesta por `memories_public`: foto/video suelto de la familia,
// sin atar a una persona puntual del arbol.
export type Memory = {
  id: string;
  media_url: string;
  media_type: MediaType;
  caption: string | null;
  display_order: number;
};

// Fila completa de `memories`, solo para el panel (incluye is_active y
// private_note, igual que AdminPerson/people).
export type AdminMemory = {
  id: string;
  media_url: string;
  media_type: MediaType;
  caption: string | null;
  is_active: boolean;
  private_note: string | null;
  display_order: number;
};

export type AdminMemoryInput = Omit<AdminMemory, "id" | "display_order"> & {
  display_order?: number;
};
