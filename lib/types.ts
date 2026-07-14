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

// Persona ya resuelta en el arbol, con su generacion respecto al hijo de
// mama del que cuelga (0 = el hijo mismo, 1 = nieto/esposo, 2 = bisnieto...).
export type TreePerson = PublicPerson & {
  depth: number;
};

export type FamilyTree = {
  hijos: PublicPerson[];
  personById: Map<string, PublicPerson>;
  descendantsByHijo: Map<string, TreePerson[]>;
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

// Fila de `routine_blocks`. No tiene datos sensibles, se lee y escribe igual
// para la app de mama (solo lectura) y el panel (lectura/escritura).
export type RoutineBlock = {
  id: string;
  time_label: string | null;
  start_hour: number;
  end_hour: number;
  icon: string | null;
  title: string;
  description: string | null;
  audio_url: string | null;
  display_order: number;
};

export type RoutineBlockInput = Omit<RoutineBlock, "id" | "display_order"> & {
  display_order?: number;
};
