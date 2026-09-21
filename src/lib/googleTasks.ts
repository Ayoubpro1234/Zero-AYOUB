export interface GoogleTaskItem {
  id?: string;
  title: string;
  notes?: string;
  status?: 'needsAction' | 'completed';
  due?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
}

/**
 * Fetch or get primary TaskList
 */
export async function getPrimaryTaskList(accessToken: string): Promise<string> {
  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load Google Task lists: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id;
  }
  return '@default';
}

/**
 * Create a new task in Google Tasks
 */
export async function createGoogleTask(
  accessToken: string,
  title: string,
  notes?: string,
  listId = '@default'
): Promise<GoogleTaskItem> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      title,
      notes: notes || 'ZERO — Urge Interceptor healthy behavioral habit task',
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Failed to create Google Task: ${res.status} ${errBody}`);
  }

  return await res.json();
}

/**
 * Mark task as completed in Google Tasks
 */
export async function completeGoogleTask(
  accessToken: string,
  taskId: string,
  listId = '@default'
): Promise<void> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'completed',
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to complete Google Task: ${res.statusText}`);
  }
}
