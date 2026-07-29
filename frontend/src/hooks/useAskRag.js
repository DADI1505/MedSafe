import { useMutation } from "@tanstack/react-query"
import { askRag } from "../api/services"

/*
  ============================================================
  useAskRag — Hook personnalisé (TanStack Query)
  ============================================================
  On utilise useMutation car "poser une question" est une ACTION
  déclenchée par l'utilisateur (pas un chargement automatique).

  Ce hook expose tout ce dont la page a besoin :
   - mutate(question) : lance la requête
   - data      : la réponse en cas de succès
   - isPending : true pendant le chargement
   - isError / error : en cas d'échec réseau/serveur
   - reset()   : pour repartir d'un état vierge
*/
export function useAskRag() {
  return useMutation({
    // La fonction qui appelle réellement le backend.
    mutationFn: (question) => askRag(question),
    // On ne réessaie pas automatiquement : l'utilisateur décide via "Réessayer".
    retry: false,
  })
}
