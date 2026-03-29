export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: 'technical' | 'administrative' | 'strategic';
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'active' | 'on-hold' | 'completed';
  lastUpdate: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
