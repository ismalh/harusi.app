import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation — Harusi" },
      { name: "description", content: "Les règles d'utilisation de Harusi." },
    ],
  }),
  component: CguPage,
});

function CguPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/settings" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-lg font-semibold">Conditions d'utilisation</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 text-sm leading-relaxed">
        <p className="text-muted-foreground text-xs">Dernière mise à jour : 11 juin 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Objet</h2>
          <p>
            Harusi est une plateforme de mise en relation matrimoniale destinée aux musulmans
            majeurs souhaitant rencontrer un futur conjoint dans le cadre du mariage halal.
            En vous inscrivant, vous acceptez les présentes conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. Conditions d'inscription</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Être majeur·e (18 ans minimum)</li>
            <li>Être célibataire, veuf·ve ou divorcé·e</li>
            <li>Disposer d'un numéro de téléphone valide</li>
            <li>S'inscrire avec son identité réelle (un seul compte par personne)</li>
            <li>Avoir une démarche sérieuse en vue du mariage</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. Règles de conduite</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respecter les autres membres dans ses échanges</li>
            <li>Ne publier aucun contenu offensant, à caractère sexuel, raciste ou contraire aux valeurs de l'islam</li>
            <li>Ne pas demander d'argent ni accepter d'avantages financiers</li>
            <li>Ne pas créer de faux profil ni usurper l'identité d'autrui</li>
            <li>Signaler tout comportement suspect ou inapproprié</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. Modération</h2>
          <p>
            L'équipe de Harusi se réserve le droit de suspendre ou bannir tout compte ne
            respectant pas ces règles, sans préavis ni remboursement. Les administrateurs
            peuvent consulter les conversations dans le cadre strict de la modération
            (voir la <Link to="/privacy" className="text-emerald-700 underline">Politique de confidentialité</Link>).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Wali (tuteur)</h2>
          <p>
            Conformément à la tradition islamique, les sœurs peuvent désigner un wali (tuteur)
            qui sera informé des échanges sérieux. Cette fonctionnalité est encouragée mais
            reste à la discrétion de l'utilisatrice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Données personnelles</h2>
          <p>
            La collecte et le traitement de vos données est décrit dans la{" "}
            <Link to="/privacy" className="text-emerald-700 underline">Politique de confidentialité</Link>.
            Vous disposez à tout moment des droits RGPD (accès, rectification, suppression).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Responsabilité</h2>
          <p>
            Harusi est un service de mise en relation. Nous ne pouvons être tenus responsables
            des comportements des membres en dehors de la plateforme, ni du succès ou de l'échec
            d'une rencontre. Chaque utilisateur reste responsable de ses choix et de sa sécurité.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Suppression du compte</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis les Réglages.
            Vos données seront effacées dans un délai de 30 jours, sauf obligation légale
            de conservation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Évolution des conditions</h2>
          <p>
            Ces conditions peuvent évoluer. En cas de modification importante, vous serez
            notifié·e dans l'application. La poursuite de l'utilisation vaut acceptation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">10. Contact</h2>
          <p>
            Pour toute question, utilisez la fonction de contact disponible dans les Réglages.
          </p>
        </section>
      </main>
    </div>
  );
}
