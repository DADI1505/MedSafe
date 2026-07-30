// src/hooks/useAuditHistory.js
// Récupère l'historique des questions de l'utilisateur connecté.

import { useQuery } from "@tanstack/react-query"
import { getAuditHistory } from "../api/services"

export function useAuditHistory() {
  return useQuery({
    queryKey: ["audit-history"],
    queryFn: getAuditHistory,
  })
}