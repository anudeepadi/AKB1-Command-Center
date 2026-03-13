import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ToolDraftRecord } from "@shared/contracts";

async function fetchDraft<T>(toolId: string): Promise<ToolDraftRecord<T>> {
  const res = await fetch(`/api/tools/${toolId}/draft`);
  if (!res.ok) {
    throw new Error(`Failed to load draft: ${res.status}`);
  }

  return res.json();
}

async function persistDraft<T>(toolId: string, payload: T): Promise<ToolDraftRecord<T>> {
  const res = await fetch(`/api/tools/${toolId}/draft`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });

  if (!res.ok) {
    throw new Error(`Failed to save draft: ${res.status}`);
  }

  return res.json();
}

export function useToolDraft<T>(toolId: string, fallback: T) {
  const qc = useQueryClient();
  const queryKey = ["/api/tools", toolId, "draft"];

  const query = useQuery<ToolDraftRecord<T>>({
    queryKey,
    queryFn: () => fetchDraft(toolId),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (payload: T) => persistDraft(toolId, payload),
    onSuccess: async (draft) => {
      qc.setQueryData(queryKey, draft);
      await qc.invalidateQueries({ queryKey: ["/api/bootstrap"] });
    },
  });

  return {
    draft: query.data?.payload ?? fallback,
    updatedAt: query.data?.updatedAt ?? null,
    isReady: query.isSuccess,
    isSaving: mutation.isPending,
    saveDraft: mutation.mutate,
    saveDraftAsync: mutation.mutateAsync,
  };
}
