// import Header from "../components/Header"
// import AskForm from "../components/AskForm"
// import AnswerSkeleton from "../components/AnswerSkeleton"
// import AnswerCard from "../components/AnswerCard"
// import SafetyNotice from "../components/SafetyNotice"
// import NetworkError from "../components/NetworkError"
// import { useAskRag } from "../hooks/useAskRag"

// /*
//   ============================================================
//   Ask — PAGE PRINCIPALE (cœur du produit)
//   ============================================================
//   Elle orchestre les 4 états demandés dans le cahier des charges :
//     1. Chargement explicite   -> <AnswerSkeleton />
//     2. Succès (safe)          -> <AnswerCard />
//     3. warning / blocked      -> <SafetyNotice />
//     4. Erreur réseau          -> <NetworkError />

//   Toute la logique réseau est déléguée au hook useAskRag (React Query),
//   ce qui garde ce composant simple et lisible.
// */
// export default function Ask() {
//   const { mutate, data, isPending, isError, error, variables } = useAskRag()

//   // Déclenché à la soumission du formulaire.
//   function handleAsk(question) {
//     mutate(question)
//   }

//   // Relance la DERNIÈRE question en cas d'erreur (bouton "Réessayer").
//   function handleRetry() {
//     if (variables) mutate(variables)
//   }

//   // Petite fonction qui décide QUEL composant afficher selon l'état.
//   function renderResult() {
//     // 1. Chargement en cours
//     if (isPending) return <AnswerSkeleton />

//     // 4. Erreur réseau / serveur (message clair via l'intercepteur Axios)
//     if (isError) {
//       return <NetworkError message={error?.userMessage} onRetry={handleRetry} />
//     }

//     // Rien n'a encore été demandé : on n'affiche pas de résultat.
//     if (!data) return null

//     // 3. Cas sensibles : warning ou blocked
//     if (data.risk_level === "warning" || data.risk_level === "blocked") {
//       return <SafetyNotice result={data} />
//     }

//     // 2. Succès classique (safe)
//     return <AnswerCard result={data} />
//   }

//   return (
//     <div className="min-h-screen bg-canvas">
      

//       <main className="mx-auto max-w-3xl px-4 py-8">
//         {/* Titre de la page */}
//         <div className="mb-6 text-center">
//           <h1 className="text-balance text-3xl font-bold text-brand sm:text-4xl">
//             Vérifiez la sécurité de vos médicaments
//           </h1>
//           <p className="mt-2 text-pretty text-muted">
//             Des réponses claires, appuyées sur les notices officielles openFDA.
//           </p>
//         </div>

//         {/* Formulaire de saisie */}
//         <AskForm onSubmit={handleAsk} isLoading={isPending} />

//         {/* Zone de résultat (change selon l'état) */}
//         <div className="mt-6">{renderResult()}</div>
//       </main>
//     </div>
//   )
// }

import { useAskRag } from "../hooks/useAskRag"
import AskHero from "../components/AskHero"
import AskForm from "../components/AskForm"
import AnswerSkeleton from "../components/AnswerSkeleton"
import AnswerCard from "../components/AnswerCard"
import SafetyNotice from "../components/SafetyNotice"
import NetworkError from "../components/NetworkError"

export default function Ask() {
  const { mutate: askQuestion, data: result, isPending, isError, reset } = useAskRag()

  function handleAsk(question) {
    askQuestion(question)
  }

  function handleNewQuestion() {
    reset()
  }

  // Avant toute question : écran d'accueil façon Copilot (le grand champ, PAS compact)
  if (!result && !isPending && !isError) {
    return <AskHero onSubmit={handleAsk} isLoading={isPending} />
  }

  // Après une question : champ compact en haut + résultat en dessous
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">

      {/* ↓↓↓ C'EST ICI, et seulement ici, que va la ligne ↓↓↓ */}
      <AskForm onSubmit={handleAsk} isLoading={isPending} compact />
      {/* ↑↑↑ juste après l'ouverture de la div, avant tout le reste ↑↑↑ */}

      {isPending && <AnswerSkeleton />}
      {isError && <NetworkError onRetry={handleNewQuestion} />}

      {result && result.risk_level === "safe" && <AnswerCard result={result} />}
      {result && (result.risk_level === "warning" || result.risk_level === "blocked") && (
        <SafetyNotice result={result} />
      )}
    </div>
  )
}
