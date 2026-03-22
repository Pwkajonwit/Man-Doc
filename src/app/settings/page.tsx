import { ArchiveShell } from "@/components/archive-shell";
import { SettingsForm } from "@/components/settings-form";
import { getConfiguredGasWebAppUrl } from "@/lib/gas-config";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const gasWebAppUrl = await getConfiguredGasWebAppUrl();

  return (
    <ArchiveShell active="documents">
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <SettingsForm initialUrl={gasWebAppUrl} />
      </section>
    </ArchiveShell>
  );
}
