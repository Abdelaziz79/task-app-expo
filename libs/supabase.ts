import { Team, User } from "@/types/types";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient(
  "https://uibqfaydlnkujfskugyy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpYnFmYXlkbG5rdWpmc2t1Z3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNDI4MDAsImV4cCI6MjA0NjgxODgwMH0.lFzxwsIrUqZmr56GlDhS_shNOc4pmE41KKo4W_vPLqw"
);

export async function createUser(userData: User) {
  const { data, error } = await supabase.from("users").insert([userData]);
  if (error) {
    throw error;
  }
  return data;
}

export async function createTeam(teamData: Team) {
  const { data, error } = await supabase.from("teams").insert([teamData]);
  if (error) {
    throw error;
  }
  return data;
}

export async function getTeams() {
  const { data, error } = await supabase.from("teams").select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function uploadImage(file: any) {
  try {
    // Create a unique file name using timestamp
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

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

export async function getUsers() {
  // Get users with their team information using a join
  const { data, error } = await supabase.from("users").select(`
      *,
      team:teams(name)
    `);

  if (error) {
    throw error;
  }

  // Transform the nested team object to just the team name
  const newData = data.map((user) => ({
    ...user,
    team: user.team?.name || null,
  }));

  return newData;
}

export async function getTeamById(teamId: number) {
  const { data, error } = await supabase
    .from("teams")
    .select("name")
    .eq("id", teamId)
    .single();

  if (error) {
    throw error;
  }
  return data;
}
