"use client";

import {
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export type AddressParts = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type Suggestion = AddressParts & {
  id: string;
  placeId?: string;
  label: string;
};

type SuggestPayload = {
  ok?: boolean;
  enabled?: boolean;
  error?: string;
  suggestion?: Suggestion;
  suggestions?: Suggestion[];
};

type Props = {
  id: string;
  name?: string;
  value: string;
  required?: boolean;
  error?: string;
  onStreetChange: (street: string) => void;
  onSelect: (parts: AddressParts) => void;
  onInteract?: () => void;
};

const DEBOUNCE_MS = 300;

function newSessionToken() {
  try {
    // Places session tokens: ≤36 URL/filename-safe ASCII chars (UUID v4 is ideal).
    return crypto.randomUUID();
  } catch {
    return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function AddressAutocomplete({
  id,
  name = "address",
  value,
  required,
  error,
  onStreetChange,
  onSelect,
  onInteract,
}: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef(newSessionToken());
  const enabledRef = useRef(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  /** null = probing; true = Places ready; false = unavailable (manual entry). */
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [unavailableNote, setUnavailableNote] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onDocPointer = (event: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
    };
  }, []);

  // Probe once on mount so missing key isn't a silent failure after 3 keystrokes.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/address-suggest?q=", { signal: controller.signal });
        const payload = (await res.json().catch(() => null)) as SuggestPayload | null;
        if (controller.signal.aborted) return;
        if (payload?.enabled === false) {
          enabledRef.current = false;
          setEnabled(false);
          setUnavailableNote("Address suggestions unavailable — enter address manually");
          return;
        }
        enabledRef.current = true;
        setEnabled(true);
        setUnavailableNote(null);
      } catch {
        if (controller.signal.aborted) return;
        // Network blip — keep optimistic; typing will re-check.
        enabledRef.current = true;
        setEnabled(true);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const markUnavailable = (message?: string) => {
    enabledRef.current = false;
    setEnabled(false);
    setUnavailableNote(message || "Address suggestions unavailable — enter address manually");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    setLoading(false);
  };

  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!enabledRef.current || query.trim().length < 3) {
      abortRef.current?.abort();
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query.trim(),
          session: sessionRef.current,
        });
        const res = await fetch(`/api/address-suggest?${params}`, {
          signal: controller.signal,
        });
        const payload = (await res.json().catch(() => null)) as SuggestPayload | null;
        if (controller.signal.aborted) return;

        if (payload?.enabled === false) {
          markUnavailable();
          return;
        }

        if (!res.ok || payload?.ok === false) {
          // Transient Google/proxy failure — keep trying on later keystrokes,
          // but surface a non-blocking note so it isn't silent.
          setUnavailableNote(
            payload?.error || "Address suggestions unavailable — enter address manually",
          );
          setSuggestions([]);
          setOpen(false);
          setActiveIndex(-1);
          return;
        }

        setUnavailableNote(null);
        const next = Array.isArray(payload?.suggestions) ? payload!.suggestions! : [];
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIndex(next.length ? 0 : -1);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
        setUnavailableNote("Address suggestions unavailable — enter address manually");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  const resolveAndApply = async (suggestion: Suggestion) => {
    const placeId = suggestion.placeId || suggestion.id;
    // Prefer Place Details so city/state/ZIP are complete.
    if (placeId && enabledRef.current) {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          placeId,
          session: sessionRef.current,
        });
        const res = await fetch(`/api/address-suggest?${params}`);
        const payload = (await res.json().catch(() => null)) as SuggestPayload | null;
        const detailed =
          payload?.suggestion ||
          (Array.isArray(payload?.suggestions) ? payload!.suggestions![0] : null);
        if (detailed) {
          onSelect({
            street: detailed.street || suggestion.street,
            city: detailed.city || "",
            state: detailed.state || "",
            zip: detailed.zip || "",
          });
          sessionRef.current = newSessionToken();
          setSuggestions([]);
          setOpen(false);
          setActiveIndex(-1);
          return;
        }
      } catch {
        /* fall through to label-based apply */
      } finally {
        setLoading(false);
      }
    }

    onSelect({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zip: suggestion.zip,
    });
    sessionRef.current = newSessionToken();
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }
    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      void resolveAndApply(suggestions[activeIndex]);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const suggestionsOn = enabled === true;
  const hint =
    enabled === false || unavailableNote
      ? unavailableNote || "Address suggestions unavailable — enter address manually"
      : enabled === null
        ? "Checking address suggestions…"
        : loading
          ? "Looking up addresses…"
          : "Start typing — choose a suggestion to fill city, state, and ZIP";

  return (
    <div className="address-autocomplete" ref={wrapRef}>
      <input
        id={id}
        name={name}
        autoComplete="street-address"
        required={required}
        value={value}
        placeholder="Street address"
        aria-invalid={Boolean(error)}
        aria-describedby={
          [error ? `${id}-err` : null, `${id}-hint`].filter(Boolean).join(" ") || undefined
        }
        aria-autocomplete={suggestionsOn ? "list" : undefined}
        aria-controls={suggestionsOn ? listId : undefined}
        aria-expanded={suggestionsOn ? open : undefined}
        role={suggestionsOn ? "combobox" : undefined}
        onFocus={onInteract}
        onChange={(e) => {
          onInteract?.();
          onStreetChange(e.target.value);
          if (enabledRef.current) fetchSuggestions(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {error ? (
        <span id={`${id}-err`} className="field-error">
          {error}
        </span>
      ) : null}
      <span
        id={`${id}-hint`}
        className={
          enabled === false || unavailableNote
            ? "address-autocomplete__hint address-autocomplete__hint--unavailable"
            : "address-autocomplete__hint"
        }
        role={enabled === false || unavailableNote ? "status" : undefined}
      >
        {hint}
      </span>
      {suggestionsOn && open && suggestions.length ? (
        <ul
          id={listId}
          className="address-autocomplete__list"
          role="listbox"
          aria-label="Address suggestions"
        >
          {suggestions.map((suggestion, index) => {
            const active = index === activeIndex;
            return (
              <li key={suggestion.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={
                    active
                      ? "address-autocomplete__option is-active"
                      : "address-autocomplete__option"
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => void resolveAndApply(suggestion)}
                >
                  {suggestion.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
