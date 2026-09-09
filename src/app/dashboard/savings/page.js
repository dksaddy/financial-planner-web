"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlus, FiTrendingUp } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Spinner from "@/components/common/Spinner";
import SavingPlanCard from "@/components/dashboard/SavingPlanCard";
import AddSavingPlanModal from "@/components/dashboard/AddSavingPlanModal";
import EditSavingPlanModal from "@/components/dashboard/EditSavingPlanModal";
import DeleteSavingPlanDialog from "@/components/dashboard/DeleteSavingPlanDialog";
import DepositModal from "@/components/dashboard/DepositModal";

import {
  getSavingPlans,
  setSavingPlanStatus,
} from "@/services/savingPlans.service";
import { normalizeSavingPlan } from "@/lib/savingPlan";
import { isAuthenticated } from "@/lib/auth";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function AllSavingPlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [depositPlan, setDepositPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [statusPendingId, setStatusPendingId] = useState(null);

  const fetchPlans = async () => {
    try {
      const response = await getSavingPlans();

      // Unlike /dashboard, this endpoint returns raw rows, so the derived
      // figures the card needs are computed here.
      setPlans((response.data || []).map(normalizeSavingPlan));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load saving plans"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (plan, status) => {
    try {
      setStatusPendingId(plan.id);

      const response = await setSavingPlanStatus(plan.id, status);

      toast.success(response.message);

      await fetchPlans();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change plan status"
      );
    } finally {
      setStatusPendingId(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchPlans();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading saving plans…</p>
      </main>
    );
  }

  const visible =
    filter === "all"
      ? plans
      : plans.filter((plan) => plan.status === filter);

  const activeCount = plans.filter(
    (plan) => plan.status === "active"
  ).length;

  const totalDeposited = plans.reduce(
    (sum, plan) => sum + plan.currentlyDeposited,
    0
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="reveal mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
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
              All Saving Plans
            </h1>

            {/* Each stat carries its own dot instead of one leading dot and
                "·" separators: when the line wraps on a phone the marker
                stays with its own figure. */}
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-dot" />
                {activeCount} active of {plans.length}
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-dot" />
                <span className="num">{totalDeposited.toFixed(2)}</span>{" "}
                deposited
              </span>
            </p>
          </div>
        </div>

      </div>

      <AddSavingPlanModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchPlans}
      />

      <EditSavingPlanModal
        open={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onSuccess={fetchPlans}
      />

      <DeleteSavingPlanDialog
        open={Boolean(deletingPlan)}
        onClose={() => setDeletingPlan(null)}
        plan={deletingPlan}
        onSuccess={fetchPlans}
      />

      <DepositModal
        open={Boolean(depositPlan)}
        onClose={() => setDepositPlan(null)}
        plan={depositPlan}
        onSuccess={fetchPlans}
      />

      <div className="reveal" style={{ animationDelay: "70ms" }}>
        <Section
          title="Saving Plans"
          icon={FiTrendingUp}
          accent="emerald"
          centerActions={
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {FILTERS.map((option) => {
                const isSelected = filter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    aria-pressed={isSelected}
                    className={`flex h-8 items-center justify-center rounded-xl border px-3 text-[12.54px] font-bold uppercase tracking-wider leading-none transition active:scale-95 ${
                      isSelected
                        ? "border-emerald-line bg-emerald-soft text-emerald-fg"
                        : "border-line-soft bg-inset text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          }
          actions={
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 px-3.5 text-[12.54px] font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 hover:brightness-110 active:scale-95"
            >
              <FiPlus size={14} strokeWidth={2.6} />
              Add Plan
            </button>
          }
        >
          {visible.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              {plans.length === 0
                ? "No saving plans yet."
                : `No ${filter} saving plans.`}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((plan) => (
                <SavingPlanCard
                  key={plan.id}
                  plan={plan}
                  onDeposit={setDepositPlan}
                  onEdit={setEditingPlan}
                  onDelete={setDeletingPlan}
                  onStatusChange={changeStatus}
                  statusPending={statusPendingId === plan.id}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
