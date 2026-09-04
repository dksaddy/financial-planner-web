"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiTarget,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import AddTargetModal from "@/components/dashboard/AddTargetModal";
import EditTargetModal from "@/components/dashboard/EditTargetModal";
import DeleteTargetDialog from "@/components/dashboard/DeleteTargetDialog";
import Spinner from "@/components/common/Spinner";

import { getTargets } from "@/services/targets.service";
import { getDashboard } from "@/services/dashboard.service";
import { isAuthenticated } from "@/lib/auth";

export default function AllTargetsPage() {
  const router = useRouter();

  const [targets, setTargets] = useState(null);
  const [availableSaving, setAvailableSaving] = useState(0);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchTargets();
  }, [router]);

  const fetchTargets = async () => {
    try {
      const [targetsRes, dashboardRes] = await Promise.all([
        getTargets(),
        getDashboard(),
      ]);

      setTargets(targetsRes.data);
      setAvailableSaving(
        Number(dashboardRes.data?.extraSaving?.totalExtraSave) || 0
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load targets"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading targets…</p>
      </main>
    );
  }

  const pending = (targets || []).filter((t) => t.status === "pending");
  const completed = (targets || []).filter((t) => t.status === "completed");

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="reveal mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </Link>

          <div>
            <h1 className="text-[26px] font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              All Targets
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-dot" />
              {pending.length} pending · {completed.length} completed
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 px-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50 hover:brightness-110 active:scale-95"
        >
          <FiPlus size={16} strokeWidth={2.6} />
          Add Target
        </button>
      </div>

      <AddTargetModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchTargets}
      />

      <EditTargetModal
        open={Boolean(editTarget)}
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={fetchTargets}
      />

      <DeleteTargetDialog
        open={Boolean(deleteTarget)}
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={fetchTargets}
      />

      <div className="reveal space-y-4" style={{ animationDelay: "70ms" }}>
        <Section title="Pending" icon={FiTarget} accent="fuchsia">
          {pending.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              No pending targets.
            </p>
          ) : (
            <div className="space-y-2">
              {pending.map((target) => {
                const targetAmount = Number(target.target_amount) || 0;
                const percent =
                  targetAmount > 0
                    ? Math.min(
                        (availableSaving / targetAmount) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={target.id}
                    className="rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 transition hover:border-fuchsia-line hover:bg-fuchsia-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {target.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={target.image_url}
                            alt={target.name}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-line"
                          />
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-fuchsia-soft text-fuchsia-fg ring-1 ring-line">
                            <FiTarget size={16} />
                          </span>
                        )}

                        <span className="truncate text-sm font-medium text-ink">
                          {target.name}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5">
                        <span className="num text-base font-bold text-fuchsia-fg">
                          {targetAmount.toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => setEditTarget(target)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition hover:bg-surface-hover hover:text-ink"
                          aria-label={`Edit ${target.name}`}
                        >
                          <FiEdit2 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(target)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition hover:bg-rose-soft hover:text-rose-fg"
                          aria-label={`Delete ${target.name}`}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                        <div
                          className="bar-grow h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="num shrink-0 text-[11px] font-bold text-fuchsia-fg">
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        <Section title="Completed" icon={FiCheckCircle} accent="emerald">
          {completed.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              No completed targets yet.
            </p>
          ) : (
            <div className="space-y-2">
              {completed.map((target) => (
                <div
                  key={target.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {target.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={target.image_url}
                        alt={target.name}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-line"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-soft text-emerald-fg ring-1 ring-line">
                        <FiCheckCircle size={16} />
                      </span>
                    )}

                    <span className="truncate text-sm font-medium text-ink">
                      {target.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="num text-base font-bold text-emerald-fg">
                      {Number(target.target_amount).toFixed(2)}
                    </span>

                    <span className="rounded-full bg-emerald-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-fg ring-1 ring-inset ring-emerald-line">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}