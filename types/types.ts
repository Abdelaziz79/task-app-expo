export type User = {
  name: string;
  password: string;
  role: string;
  image: string;
  email: string;
  id: string;
  teams: string[];
  created_at: string;
};

export type Team = {
  id: string;
  created_at: string;
  name: string;
  description: string;
};

export type Notification = {
  user_id: string;
  message: string;
  task_id: string;
  read: boolean;
  type: "new_task" | "completed_task";
};

export type NotificationPayload = {
  id: number;
  user_id: string;
  created_at: string;
  message: string;
  type: "new_task" | "completed_task";
  read: boolean;
  task_id?: number;
};

export type Task = {
  id: string;
  created_at: string;
  content: string;
  finished: boolean;
  seen: boolean;
  from: string;
  to: string;
  images: string[];
  team: string;
};

export type ImageFile = {
  uri: string;
  type: string;
  name: string;
  base64: string | null | undefined;
};

export type TaskCardProps = {
  task: {
    id: string;
    content: string;
    created_at: string;
    finished: boolean;
    from: {
      name: string;
      image: string;
      id: string;
    };
    to: {
      name: string;
      image: string;
      id: string;
    };
    images: string[];
    team: string;
    seen?: boolean;
  };
  showSeen?: boolean;
  currentUserId: string;
  showCompleteButton?: boolean;
  fromUser?: boolean;
};
