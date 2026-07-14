"use client";

import { useRef } from "react";
import { speak, stopSpeaking } from "@/lib/tts";
import type { PublicPerson } from "@/lib/types";

// Debe llamarse SIEMPRE dentro del mismo handler sincrono del toque que la
// origina (nunca desde un efecto disparado despues de una navegacion), para
// que las politicas de autoplay de moviles no bloqueen la reproduccion.
export function usePersonAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stop() {
    audioRef.current?.pause();
    stopSpeaking();
  }

  function playFor(person: Pick<PublicPerson, "name" | "relation" | "audio_url">) {
    stop();

    if (person.audio_url) {
      const audio = new Audio(person.audio_url);
      audioRef.current = audio;
      audio.play().catch(() => {
        speak(person.name);
      });
      return;
    }

    speak(person.name);
  }

  return { playFor, stop };
}
