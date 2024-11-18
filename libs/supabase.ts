import { Notification } from "@/types/types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uibqfaydlnkujfskugyy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpYnFmYXlkbG5rdWpmc2t1Z3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNDI4MDAsImV4cCI6MjA0NjgxODgwMH0.lFzxwsIrUqZmr56GlDhS_shNOc4pmE41KKo4W_vPLqw"
);

// USERS

export async function createUser(userData: {
  name: string;
  password: string;
  image: string;
  teams: string[];
  role: string;
  email: string;
}) {
  const { data, error } = await supabase.from("users").insert([userData]);
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function addUserToTeam(userId: string, teamName: string) {
  // First, get the user's current teams
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("teams")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.log(fetchError);
    throw fetchError;
  }

  // Create new teams array with existing teams and new team
  const updatedTeams = [...(userData.teams || []), teamName];

  // Update the user with the new teams array
  const { data, error } = await supabase
    .from("users")
    .update({ teams: updatedTeams })
    .eq("id", userId);

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getUsers() {
  // Get users with their team information using a join
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
    throw error;
  }

  // Transform the nested team object to just the team name
  const newData = data.map((user) => ({
    ...user,
    team: user.team?.name || null,
  }));

  return newData;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getUsersByTeamName(teamName: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .contains("teams", [teamName])
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getUserTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`*, from(name, image, id), to(name, image, id)`)
    .eq("to", userId)
    .eq("finished", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getUsersNames() {
  const { data, error } = await supabase
    .from("users")
    .select("name, id")
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

// TEAMS

export async function createTeam(teamData: {
  name: string;
  description: string;
}) {
  const { data, error } = await supabase.from("teams").insert([teamData]);
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTeamById(teamId: number) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTeamByName(name: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("name", name)
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

// TASKS

export async function createTask(taskData: {
  content: string;
  images: string[];
  from: string;
  to: string;
  team: string;
  from_name: string;
  to_name: string;
}) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          content: taskData.content,
          images: taskData.images,
          from: taskData.from,
          to: taskData.to,
          team: taskData.team,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // Create notification for task receiver
    await createNotification({
      user_id: taskData.to,
      message: `You have a new task from ${taskData.from_name}`,
      task_id: data?.id ?? null,
      read: false,
      type: "new_task",
    });

    // Create notification for task sender
    await createNotification({
      user_id: taskData.from,
      message: `You have successfully assigned a task to ${taskData.to_name}`,
      task_id: data?.id ?? null,
      read: false,
      type: "new_task",
    });

    return data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function seenTask(taskId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ seen: true })
    .eq("id", taskId);
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function completeTask(taskId: string) {
  try {
    const task = await getTaskById(taskId);

    const { data, error } = await supabase
      .from("tasks")
      .update({ finished: true })
      .eq("id", taskId);

    if (error) throw error;

    // Create notification for task creator
    await createNotification({
      user_id: task.from.id,
      message: `${task.to.name} has completed the task`,
      task_id: task.id,
      read: false,
      type: "completed_task",
    });

    // Create notification for task completer
    await createNotification({
      user_id: task.to.id,
      message: `You have completed the task successfully`,
      task_id: task.id,
      read: false,
      type: "completed_task",
    });

    return data;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
}

export async function getTaskById(taskId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, from(name, id), to(name, id)")
    .eq("id", taskId)
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("finished")
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTasksByTeam(team: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("team", team)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTasksByUser(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`*, to(name, image, id), from(name, image, id)`)
    .eq("from", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getCompletedTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`*, from(name, image, id), to(name, image, id)`)
    .eq("to", userId)
    .eq("finished", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getTasksByState(state: string) {
  if (state === "all") {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, from(name, image, id), to(name, image, id)")
      .order("created_at", { ascending: false });
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  } else if (state === "pending") {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, from(name, image, id), to(name, image, id)")
      .eq("finished", false)
      .order("created_at", { ascending: false });
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  } else if (state === "completed") {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, from(name, image, id), to(name, image, id)")
      .eq("finished", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  }
  return [];
}

// NOTIFICATIONS

export async function createNotification(notificationData: Notification) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([notificationData]);

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId);
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

// STORAGE

export async function uploadImage(file: any) {
  try {
    // Create a unique file name using timestamp
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    // Upload the file to the 'storage' bucket
    const { data, error } = await supabase.storage
      .from("storage")
      .upload(fileName, file);

    if (error) throw error;

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("storage").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
