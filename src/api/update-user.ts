import { api } from "@/lib/api"

interface UpdateUserProps {
  id: string
  status: string
}

export async function updateUser({ id, status }: UpdateUserProps) {
  const response = await api.put(`/users/update-status/${id}`, {
    status,
  });

  return response.data
}