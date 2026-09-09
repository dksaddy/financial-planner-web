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
  FiRotateCcw,
} from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import AddTargetModal from "@/components/dashboard/AddTargetModal";
import EditTargetModal from "@/components/dashboard/EditTargetModal";
import DeleteTargetDialog from "@/components/dashboard/DeleteTargetDialog";
import Spinner from "@/components/common/Spinner";

import { getTargets, updateTargetStatus } from "@/services/targets.service";
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
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Animation state: item currently playing its exit pulse (before it
  // switches sections) and item currently playing its arrival glow
  // (right after it lands in the new section).
  const [exitingId, setExitingId] = useState(null);
  const [exitingDirection, setExitingDirection] = useState(null); // "completed" | "pending"
  const [enteringId, setEnteringId] = useState(null);
  const [enteringDirection, setEnteringDirection] = useState(null);

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

  const handleToggleStatus = async (target) => {
    const nextStatus =
      target.status === "completed" ? "pending" : "completed";

    try {
      setStatusUpdatingId(target.id);
      setExitingId(target.id);
      setExitingDirection(nextStatus);

      // Run the request alongside a minimum exit-animation window so the
      // pulse always gets to play out, even on a fast network.
      const [response] = await Promise.all([
        updateTargetStatus(target.id, nextStatus),
        new Promise((resolve) => setTimeout(resolve, 420)),
      ]);

      toast.success(response.message);

      await fetchTargets();

      // Item has now landed in its new section — play the arrival glow.
      setEnteringId(target.id);
      setEnteringDirection(nextStatus);
      window.setTimeout(() => {
        setEnteringId(null);
        setEnteringDirection(null);
      }, 650);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    } finally {
      setStatusUpdatingId(null);
      setExitingId(null);
      setExitingDirection(null);
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
            <h1 className="text-[20.9px] font-bold uppercase leading-tight sm:text-[29.64px] tracking-[0.06em] text-ink">
              All Targets
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-dot" />
              {pending.length} pending · {completed.length} completed
            </p>
          </div>
        </div>

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
        <Section
          title="Pending"
          icon={FiTarget}
          accent="fuchsia"
          actions={
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 px-3.5 text-[12.54px] font-bold uppercase tracking-wider text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50 hover:brightness-110 active:scale-95"
            >
              <FiPlus size={14} strokeWidth={2.6} />
              Add Target
            </button>
          }
        >
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

                const isExiting = exitingId === target.id;
                const isEntering =
                  enteringId === target.id && enteringDirection === "pending";

                return (
                  <div
                    key={target.id}
                    className={`target-row rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 transition hover:border-fuchsia-line hover:bg-fuchsia-soft ${
                      isExiting ? "target-exit-complete" : ""
                    } ${isEntering ? "target-enter-pending" : ""}`}
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
                          disabled={statusUpdatingId === target.id}
                          onClick={() => handleToggleStatus(target)}
                          className="flex h-7 items-center gap-1 rounded-lg bg-emerald-soft px-2 text-[12.54px] font-bold uppercase tracking-wider text-emerald-fg ring-1 ring-inset ring-emerald-line transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Mark ${target.name} as completed`}
                        >
                          {statusUpdatingId === target.id ? (
                            <Spinner size={12} />
                          ) : (
                            <>
                              <FiCheckCircle size={12} />
                              Complete
                            </>
                          )}
                        </button>

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
                      <span className="num shrink-0 text-[12.54px] font-bold text-fuchsia-fg">
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
              {completed.map((target) => {
                const isExiting = exitingId === target.id;
                const isEntering =
                  enteringId === target.id &&
                  enteringDirection === "completed";

                return (
                  <div
                    key={target.id}
                    className={`target-row flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 ${
                      isExiting ? "target-exit-pending" : ""
                    } ${isEntering ? "target-enter-complete" : ""}`}
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

                      <button
                        type="button"
                        disabled={statusUpdatingId === target.id}
                        onClick={() => handleToggleStatus(target)}
                        className="flex h-7 items-center gap-1 rounded-lg bg-inset px-2 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted ring-1 ring-inset ring-line transition hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Mark ${target.name} as pending`}
                      >
                        {statusUpdatingId === target.id ? (
                          <Spinner size={12} />
                        ) : (
                          <>
                            <FiRotateCcw size={12} />
                            Pending
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>

      <style jsx>{`
        .target-row {
          will-change: transform, opacity, box-shadow;
        }

        .target-exit-complete {
          animation: exitComplete 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .target-exit-pending {
          animation: exitPending 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .target-enter-complete {
          animation: enterComplete 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .target-enter-pending {
          animation: enterPending 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes exitComplete {
          0% {
            opacity: 1;
            transform: scale(1) translateX(0);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
          35% {
            opacity: 1;
            transform: scale(1.015) translateX(3px);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
          }
          100% {
            opacity: 0;
            transform: scale(0.94) translateX(18px);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @keyframes exitPending {
          0% {
            opacity: 1;
            transform: scale(1) translateX(0);
            box-shadow: 0 0 0 0 rgba(217, 70, 239, 0);
          }
          35% {
            opacity: 1;
            transform: scale(1.015) translateX(-3px);
            box-shadow: 0 0 0 3px rgba(217, 70, 239, 0.35);
          }
          100% {
            opacity: 0;
            transform: scale(0.94) translateX(-18px);
            box-shadow: 0 0 0 0 rgba(217, 70, 239, 0);
          }
        }

        @keyframes enterComplete {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(-10px);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
          45% {
            opacity: 1;
            transform: scale(1.015) translateY(0);
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @keyframes enterPending {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(-10px);
            box-shadow: 0 0 0 0 rgba(217, 70, 239, 0);
          }
          45% {
            opacity: 1;
            transform: scale(1.015) translateY(0);
            box-shadow: 0 0 0 4px rgba(217, 70, 239, 0.3);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            box-shadow: 0 0 0 0 rgba(217, 70, 239, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .target-exit-complete,
          .target-exit-pending,
          .target-enter-complete,
          .target-enter-pending {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}