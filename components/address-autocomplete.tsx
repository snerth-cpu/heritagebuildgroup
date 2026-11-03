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
  label: string;
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

const DEBOUNCE_MS = 350;

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [attribution, setAttribution] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
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
        const res = await fetch(
          `/api/address-suggest?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        const payload = (await res.json().catch(() => null)) as
          | {
              ok?: boolean;
              suggestions?: Suggestion[];
              attribution?: string;
            }
          | null;
        if (controller.signal.aborted) return;
        const next = Array.isArray(payload?.suggestions) ? payload!.suggestions! : [];
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIndex(next.length ? 0 : -1);
        if (payload?.attribution) setAttribution(payload.attribution);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onSelect({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zip: suggestion.zip,
    });
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
      applySuggestion(suggestions[activeIndex]);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="address-autocomplete" ref={wrapRef}>
      <input
        id={id}
        name={name}
        autoComplete="street-address"
        required={required}
        value={value}
        placeholder="Start typing street address"
        aria-invalid={Boolean(error)}
        aria-describedby={
          [error ? `${id}-err` : null, `${id}-hint`].filter(Boolean).join(" ") || undefined
        }
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        role="combobox"
        onFocus={onInteract}
        onChange={(e) => {
          onInteract?.();
          onStreetChange(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {error ? (
        <span id={`${id}-err`} className="field-error">
          {error}
        </span>
      ) : null}
      <span id={`${id}-hint`} className="address-autocomplete__hint">
        {loading
          ? "Looking up addresses…"
          : "Suggestions use OpenStreetMap · tap a match to fill city, state, and ZIP"}
      </span>
      {open && suggestions.length ? (
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
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {attribution ? (
        <span className="address-autocomplete__attr">{attribution}</span>
      ) : null}
    </div>
  );
}
