import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HarusiLogo } from "@/components/HarusiLogo";
import { ISLANDS } from "@/lib/islands";
import { ChevronRight, ChevronLeft, Info } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage,
});

const TOTAL_STEPS = 6;

const LANGUES_OPTIONS = ["Shikomori", "Français", "Arabe", "Anglais", "Autres"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Étape {step} / {TOTAL_STEPS}</span>
        <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <span className="block mb-1 text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
    />
  );
}

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

function BoolField({
  label,
  value,
  onChange,
  tooltip,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  tooltip?: string;
}) {
  return (
    <Field label={label}>
      {tooltip && (
        <div className="mb-2 flex items-start gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{tooltip}</span>
        </div>
      )}
      <div className="flex gap-2">
        {[{ label: "Oui", value: true }, { label: "Non", value: false }].map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-lg border px-5 py-2 text-sm transition-colors ${
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"homme" | "femme" | "">("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [originePrincipale, setOriginePrincipale] = useState("");
  const [origineSecondaire, setOrigineSecondaire] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [nationaliteSecondaire, setNationaliteSecondaire] = useState("");
  const [island, setIsland] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [city, setCity] = useState("");
  const [langues, setLangues] = useState<string[]>([]);

  // Step 2
  const [statutMatrimonial, setStatutMatrimonial] = useState("");
  const [aDesEnfants, setADesEnfants] = useState<boolean | null>(null);
  const [nbEnfants, setNbEnfants] = useState("");
  const [accepteEnfants, setAccepteEnfants] = useState<boolean | null>(null);
  const [nbEnfantsSouhaites, setNbEnfantsSouhaites] = useState("");
  const [profession, setProfession] = useState("");

  // Step 3
  const [taille, setTaille] = useState("");
  const [corpulence, setCorpulence] = useState("");
  const [tenueVestimentaire, setTenueVestimentaire] = useState("");
  const [porteHijab, setPorteHijab] = useState<boolean | null>(null);
  const [porteBarbe, setPorteBarbe] = useState<boolean | null>(null);

  // Step 4
  const [frequencePriere, setFrequencePriere] = useState("");
  const [priereVendredi, setPriereVendredi] = useState<boolean | null>(null);
  const [rapportMosquee, setRapportMosquee] = useState("");
  const [rapportCoran, setRapportCoran] = useState("");
  const [rapportArabe, setRapportArabe] = useState("");
  const [niveauInstruction, setNiveauInstruction] = useState("");
  const [ecoleJurisprudence, setEcoleJurisprudence] = useState("");
  const [enHijra, setEnHijra] = useState<boolean | null>(null);
  const [souhaitHijra, setSouhaitHijra] = useState<boolean | null>(null);
  const [hijraQuand, setHijraQuand] = useState("");

  // Step 5
  const [accepteDemenager, setAccepteDemenager] = useState<boolean | null>(null);
  const [situationSante, setSituationSante] = useState("");
  const [enPolygamie, setEnPolygamie] = useState<boolean | null>(null);
  const [acceptePolygamie, setAcceptePolygamie] = useState<boolean | null>(null);

  // Step 6
  const [descriptionRecherche, setDescriptionRecherche] = useState("");
  const [criteresRedhibitoires, setCriteresRedhibitoires] = useState("");
  const [bio, setBio] = useState("");

  function toggleLangue(l: string) {
    setLangues((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  }

  function calcAge(dob: string) {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  async function saveStep(nextStep: number) {
    setSaving(true);
    setError(null);
    try {
      // Récupérer l'user directement pour éviter le problème de state async
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Utilisateur non connecté.");

      let patch: any = { onboarding_step: nextStep - 1 };

      if (step === 1) {
        if (!firstName || !gender || !dateNaissance || !originePrincipale || !nationalite || !island || !lieuNaissance || !city) {
          setError("Merci de remplir tous les champs obligatoires.");
          setSaving(false);
          return;
        }
        patch = {
          ...patch,
          first_name: firstName,
          gender,
          date_naissance: dateNaissance,
          age: calcAge(dateNaissance),
          origine_principale: originePrincipale,
          origine_secondaire: origineSecondaire || null,
          nationalite,
          nationalite_secondaire: nationaliteSecondaire || null,
          island,
          lieu_naissance: lieuNaissance,
          city,
          langues,
          looking_for: gender === "homme" ? "femme" : "homme",
        };
      } else if (step === 2) {
        if (!statutMatrimonial || !profession) {
          setError("Merci de remplir tous les champs obligatoires.");
          setSaving(false);
          return;
        }
        patch = {
          ...patch,
          statut_matrimonial: statutMatrimonial,
          a_des_enfants: aDesEnfants,
          nb_enfants: aDesEnfants ? (nbEnfants ? parseInt(nbEnfants) : null) : null,
          accepte_enfants: accepteEnfants,
          nb_enfants_souhaites: nbEnfantsSouhaites ? parseInt(nbEnfantsSouhaites) : null,
          profession,
        };
      } else if (step === 3) {
        patch = {
          ...patch,
          taille: taille || null,
          corpulence: corpulence || null,
          tenue_vestimentaire: tenueVestimentaire || null,
          porte_hijab: gender === "femme" ? porteHijab : null,
          porte_barbe: gender === "homme" ? porteBarbe : null,
        };
      } else if (step === 4) {
        patch = {
          ...patch,
          frequence_priere: frequencePriere || null,
          priere_vendredi: gender === "homme" ? priereVendredi : null,
          rapport_mosquee: gender === "homme" ? rapportMosquee || null : null,
          rapport_coran: rapportCoran || null,
          rapport_arabe: rapportArabe || null,
          niveau_instruction_religieuse: niveauInstruction || null,
          ecole_jurisprudence: ecoleJurisprudence || null,
          en_hijra: enHijra,
          souhaite_hijra: souhaitHijra,
          hijra_quand: souhaitHijra ? hijraQuand || null : null,
        };
      } else if (step === 5) {
        patch = {
          ...patch,
          accepte_demenager: accepteDemenager,
          situation_sante: situationSante || null,
          en_polygamie: gender === "homme" ? enPolygamie : null,
          accepte_polygamie: gender === "femme" ? acceptePolygamie : null,
        };
      } else if (step === 6) {
        // Upload photo
        let photoUrl: string | undefined;
        if (photoFile) {
          const ext = photoFile.name.split(".").pop();
          const path = `${uid}/profile.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("profile-photos")
            .upload(path, photoFile, { upsert: true });
          if (upErr) throw upErr;
          photoUrl = path;
        }
        patch = {
          ...patch,
          bio: bio || null,
          description_recherche: descriptionRecherche || null,
          criteres_redhibitoires: criteresRedhibitoires || null,
          onboarding_completed: true,
          onboarding_step: 6,
          status: "pending",
        };
        if (photoUrl) patch.photo_url = photoUrl;
      }

    const { error: dbErr } = await supabase
  .from("profiles")
  .update(patch)
  .eq("id", uid);

if (dbErr) {
  console.log("ERREUR SUPABASE:", dbErr);
  throw dbErr;
}

      if (step === 6) {
        navigate({ to: "/home" });
      } else {
        setStep(nextStep);
        window.scrollTo(0, 0);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  return (
    <div className="min-h-dvh bg-background px-4 py-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <HarusiLogo size="md" />
        </div>

        <ProgressBar step={step} />

        {/* ── ÉTAPE 1 ── */}
        {step === 1 && (
          <div>
            <h2 className="mb-4 font-serif text-xl">Identité & Origine</h2>

            <Field label="Prénom *">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ton prénom" />
            </Field>

           <Field label="Genre *">
  <select
    value={gender}
    onChange={(e) =>
      setGender(e.target.value as "homme" | "femme")
    }
    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
  >
    <option value="">Sélectionner...</option>
    <option value="homme">Homme</option>
    <option value="femme">Femme</option>
  </select>
</Field>

            <Field label="Date de naissance *">
              <Input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} max={new Date().toISOString().split("T")[0]} />
            </Field>

            <Field label="Origine principale *">
              <Input value={originePrincipale} onChange={(e) => setOriginePrincipale(e.target.value)} placeholder="ex: Comorienne, Mahoraise…" />
            </Field>

            <Field label="Deuxième origine (facultatif)">
              <Input value={origineSecondaire} onChange={(e) => setOrigineSecondaire(e.target.value)} placeholder="ex: Française, Malgache…" />
            </Field>

            <Field label="Nationalité *">
              <Input value={nationalite} onChange={(e) => setNationalite(e.target.value)} placeholder="ex: Française, Comorienne…" />
            </Field>

            <Field label="Deuxième nationalité (facultatif)">
              <Input value={nationaliteSecondaire} onChange={(e) => setNationaliteSecondaire(e.target.value)} />
            </Field>

            <Field label="Île comorienne *">
              <Select value={island} onChange={(e) => setIsland(e.target.value)}>
                <option value="">Sélectionner…</option>
                {ISLANDS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
              </Select>
            </Field>

            <Field label="Lieu de naissance *">
              <Input value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)} placeholder="Ville, pays" />
            </Field>

            <Field label="Ville de résidence *">
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris, Marseille…" />
            </Field>

 <Field label="Langues parlées">
  <div className="flex flex-wrap gap-2">
    {LANGUES_OPTIONS.map((l) => {
      const selected = langues.includes(l);

      return (
        <label
          key={l}
          className={`
            cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors
            ${
              selected
                ? "border-border bg-gray-200 text-foreground hover:bg-gray-300"
                : "border-border bg-white text-foreground hover:bg-muted"
            }
          `}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={selected}
            onChange={() => toggleLangue(l)}
          />

          {l}
        </label>
      );
    })}
  </div>
</Field>
          </div>
        )}

        {/* ── ÉTAPE 2 ── */}
       {step === 2 && (
  <div>
    <h2 className="mb-4 font-serif text-xl">Situation personnelle</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Statut matrimonial *</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setStatutMatrimonial("célibataire")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "célibataire" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Célibataire</button>
        <button type="button" onClick={() => setStatutMatrimonial("divorcé")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "divorcé" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Divorcé(e)</button>
        <button type="button" onClick={() => setStatutMatrimonial("veuf")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "veuf" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Veuf/Veuve</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">As-tu des enfants ?</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setADesEnfants(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${aDesEnfants === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
        <button type="button" onClick={() => setADesEnfants(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${aDesEnfants === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
      </div>
    </div>

    {aDesEnfants && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Nombre d'enfants</label>
        <input type="number" min={1} value={nbEnfants} onChange={(e) => setNbEnfants(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-24 bg-white" />
      </div>
    )}

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Acceptes-tu les enfants de l'autre ?</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setAccepteEnfants(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${accepteEnfants === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
        <button type="button" onClick={() => setAccepteEnfants(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${accepteEnfants === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Nombre d'enfants souhaités</label>
      <input type="number" min={0} value={nbEnfantsSouhaites} onChange={(e) => setNbEnfantsSouhaites(e.target.value)} placeholder="0" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-24 bg-white" />
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Profession *</label>
      <input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="Infirmière, Ingénieur…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white" />
    </div>

  </div>
        )}

        {step === 3 && (
  <div>
    <h2 className="mb-4 font-serif text-xl">Physique & Apparence</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Taille</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setTaille("petit")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${taille === "petit" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Petit(e)</button>
        <button type="button" onClick={() => setTaille("moyen")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${taille === "moyen" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Moyen(ne)</button>
        <button type="button" onClick={() => setTaille("grand")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${taille === "grand" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Grand(e)</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Corpulence</label>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => setCorpulence("mince")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "mince" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Mince</button>
        <button type="button" onClick={() => setCorpulence("normale")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "normale" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Normale</button>
        <button type="button" onClick={() => setCorpulence("sportive")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "sportive" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Sportive</button>
        <button type="button" onClick={() => setCorpulence("en surpoids")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "en surpoids" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>En surpoids</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Tenue vestimentaire habituelle</label>
      <input value={tenueVestimentaire} onChange={(e) => setTenueVestimentaire(e.target.value)} placeholder="ex: Abaya, Costume, Jeans…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white" />
    </div>

    {gender === "femme" && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Portes-tu le hijab ?</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPorteHijab(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${porteHijab === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
          <button type="button" onClick={() => setPorteHijab(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${porteHijab === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
        </div>
      </div>
    )}

    {gender === "homme" && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Portes-tu la barbe ?</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPorteBarbe(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${porteBarbe === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
          <button type="button" onClick={() => setPorteBarbe(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${porteBarbe === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
        </div>
      </div>
    )}

  </div>
)}

       {step === 4 && (
  <div>
    <h2 className="mb-4 font-serif text-xl">Religion & Pratique</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Fréquence de prière</label>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => setFrequencePriere("rarement")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "rarement" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Rarement</button>
        <button type="button" onClick={() => setFrequencePriere("parfois")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "parfois" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Parfois</button>
        <button type="button" onClick={() => setFrequencePriere("souvent")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "souvent" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Souvent</button>
        <button type="button" onClick={() => setFrequencePriere("toujours")} className={`px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "toujours" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Toujours</button>
      </div>
    </div>

    {gender === "homme" && (
      <>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Prières le vendredi à la mosquée ?</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPriereVendredi(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${priereVendredi === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
            <button type="button" onClick={() => setPriereVendredi(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${priereVendredi === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Ton rapport à la mosquée</label>
          <textarea rows={2} value={rapportMosquee} onChange={(e) => setRapportMosquee(e.target.value)} placeholder="Ex: J'y vais régulièrement…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
        </div>
      </>
    )}

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Ton rapport au Coran</label>
      <textarea rows={2} value={rapportCoran} onChange={(e) => setRapportCoran(e.target.value)} placeholder="Ex: Je le récite chaque soir…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Ton rapport à la langue arabe</label>
      <textarea rows={2} value={rapportArabe} onChange={(e) => setRapportArabe(e.target.value)} placeholder="Ex: Notions de base, j'apprends…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Niveau d'instruction religieuse</label>
      <input value={niveauInstruction} onChange={(e) => setNiveauInstruction(e.target.value)} placeholder="Ex: Autodidacte, cours à la mosquée…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white" />
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Es-tu en hijra ? <span className="text-gray-400 text-xs font-normal">(Quitter un pays non-musulman pour vivre en terre d'Islam)</span></label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setEnHijra(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${enHijra === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
        <button type="button" onClick={() => setEnHijra(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${enHijra === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Souhaites-tu faire la hijra ?</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setSouhaitHijra(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${souhaitHijra === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
        <button type="button" onClick={() => setSouhaitHijra(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${souhaitHijra === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
      </div>
    </div>

    {souhaitHijra && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Quand envisages-tu la hijra ?</label>
        <input value={hijraQuand} onChange={(e) => setHijraQuand(e.target.value)} placeholder="Ex: Dans 2 ans, bientôt…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white" />
      </div>
    )}

  </div>
)}

      {step === 5 && (
  <div>
    <h2 className="mb-4 font-serif text-xl">Projet de vie</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Acceptes-tu de déménager ?</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setAccepteDemenager(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${accepteDemenager === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
        <button type="button" onClick={() => setAccepteDemenager(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${accepteDemenager === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Situation de santé particulière (facultatif)</label>
      <input value={situationSante} onChange={(e) => setSituationSante(e.target.value)} placeholder="Rien à signaler, ou préciser…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white" />
    </div>

    {gender === "homme" && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Es-tu actuellement en situation de polygamie ?</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEnPolygamie(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${enPolygamie === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
          <button type="button" onClick={() => setEnPolygamie(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${enPolygamie === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
        </div>
      </div>
    )}

    {gender === "femme" && (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Acceptes-tu la polygamie ?</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setAcceptePolygamie(true)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${acceptePolygamie === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Oui</button>
          <button type="button" onClick={() => setAcceptePolygamie(false)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${acceptePolygamie === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`}>Non</button>
        </div>
      </div>
    )}

  </div>
)}

       {step === 6 && (
  <div>
    <h2 className="mb-4 font-serif text-xl">Présentation libre</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Présentation personnelle (max 1000 caractères)</label>
      <textarea rows={4} maxLength={1000} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Parle un peu de toi…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
      <span className="mt-1 text-xs text-gray-400">{bio.length}/1000</span>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Profil recherché (max 1000 caractères)</label>
      <textarea rows={4} maxLength={1000} value={descriptionRecherche} onChange={(e) => setDescriptionRecherche(e.target.value)} placeholder="Décris la personne que tu recherches…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
      <span className="mt-1 text-xs text-gray-400">{descriptionRecherche.length}/1000</span>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Critères rédhibitoires (max 500 caractères)</label>
      <textarea rows={3} maxLength={500} value={criteresRedhibitoires} onChange={(e) => setCriteresRedhibitoires(e.target.value)} placeholder="Ce que tu ne peux pas accepter…" className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none" />
      <span className="mt-1 text-xs text-gray-400">{criteresRedhibitoires.length}/500</span>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold">Photo de profil</label>
      {photoPreview ? (
        <div className="mb-2">
          <img src={photoPreview} alt="Aperçu" className="aspect-square w-32 rounded-xl object-cover" />
        </div>
      ) : (
        <div className="mb-2 flex aspect-square w-32 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
          Aucune photo
        </div>
      )}
      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        Choisir une photo
      </label>
    </div>

    <p className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-400">
      Ton profil sera examiné par notre équipe avant d'être visible. Cela prend généralement 24h.
    </p>

  </div>
)}
        )

        {/* Erreur */}
        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => { setStep(step - 1); window.scrollTo(0, 0); }}
              className="flex items-center gap-1 rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" /> Retour
            </button>
          )}
          <button
            type="button"
            onClick={() => saveStep(step + 1)}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : step === TOTAL_STEPS ? "Terminer" : "Suivant"}
            {!saving && step < TOTAL_STEPS && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}