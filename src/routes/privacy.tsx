import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Halal Match" },
      { name: "description", content: "Comment nous traitons vos données personnelles." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/mon-profil" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Politique de confidentialité</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 prose prose-sm">
        <p className="text-muted-foreground text-xs">Dernière mise à jour : 11 juin 2026</p>

        <section className="mt-6 space-y-4">
          <h2 className="text-base font-semibold">1. Données collectées</h2>
          <p className="text-sm">
            Nous collectons : numéro de téléphone, prénom, date de naissance, genre, ville, pays,
            ethnicité, niveau de pratique religieuse, biographie, photo de profil, et les messages
            échangés avec d'autres membres.
          </p>

          <h2 className="text-base font-semibold">2. Utilisation des données</h2>
          <p className="text-sm">
            Vos données servent uniquement à : créer votre profil, permettre les correspondances,
            modérer la communauté et garantir la sécurité des utilisateurs.
          </p>

          <h2 className="text-base font-semibold">3. Accès des administrateurs aux messages</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <p className="font-semibold text-amber-900">⚠️ Important</p>
            <p className="mt-1 text-amber-900">
              Pour garantir la sécurité de la communauté et lutter contre le harcèlement, les
              propos illégaux ou les comportements inappropriés, <strong>les administrateurs de
              la plateforme peuvent consulter le contenu des conversations privées</strong> entre
              utilisateurs. Cet accès est strictement réservé à la modération et n'est jamais
              utilisé à des fins commerciales ou partagé avec des tiers.
            </p>
          </div>
          <p className="text-sm">
            En utilisant l'application, vous reconnaissez avoir été informé(e) de cette possibilité
            et y consentez expressément, conformément à l'article 6 du RGPD (consentement éclairé).
          </p>

          <h2 className="text-base font-semibold">4. Partage des données</h2>
          <p className="text-sm">
            Vos informations de profil (prénom, photo approuvée, ville, etc.) sont visibles par
            les autres membres connectés. Vos données ne sont jamais vendues ni transmises à des
            tiers à des fins publicitaires.
          </p>

          <h2 className="text-base font-semibold">5. Conservation</h2>
          <p className="text-sm">
            Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la
            suppression de votre compte à tout moment depuis les réglages.
          </p>

          <h2 className="text-base font-semibold">6. Vos droits (RGPD)</h2>
          <p className="text-sm">
            Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de
            portabilité et d'opposition. Pour exercer ces droits, contactez-nous via les réglages
            de l'application.
          </p>

          <h2 className="text-base font-semibold">7. Sécurité</h2>
          <p className="text-sm">
            Vos données sont stockées sur des serveurs sécurisés et chiffrés. L'accès est limité
            aux personnes autorisées dans le cadre strict de la modération.
          </p>

          <h2 className="text-base font-semibold">8. Contact</h2>
          <p className="text-sm">
            Pour toute question relative à vos données personnelles, contactez l'équipe de
            modération via la fonction "Signaler un problème" dans les réglages.
          </p>
        </section>
      </main>
    </div>
  );
}
