import { useState, useCallback } from "react";
import { uid } from "../utils/helper";

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = "info") => {
    const id = uid();

    setToasts(t => [...t, { id, msg, type }]);

    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 3200);
  }, []);

  return { toasts, add };
}