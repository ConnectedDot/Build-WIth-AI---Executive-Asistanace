import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  MessageSquare, 
  Send, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Bell, 
  Settings, 
  User,
  Zap,
  BarChart3,
  Layers,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';
import { Task, Project, Message } from './types';

// Mock Data
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Draft technical requirements for Q3 API integration', status: 'in-progress', priority: 'high', dueDate: '2026-03-30', category: 'technical' },
  { id: '2', title: 'Quarterly Digital Transformation Review', status: 'pending', priority: 'medium', dueDate: '2026-04-05', category: 'strategic' },
  { id: '3', title: 'Automate executive scheduling workflow', status: 'completed', priority: 'high', dueDate: '2026-03-25', category: 'administrative' },
  { id: '4', title: 'Review security protocols for remote access', status: 'pending', priority: 'high', dueDate: '2026-03-29', category: 'technical' },
];

const PROJECTS: Project[] = [
  { id: '1', name: 'Cloud Migration Phase 2', progress: 65, status: 'active', lastUpdate: '2 hours ago' },
  { id: '2', name: 'AI Integration Strategy', progress: 40, status: 'active', lastUpdate: '5 hours ago' },
  { id: '3', name: 'Legacy System Decommission', progress: 90, status: 'active', lastUpdate: '1 day ago' },
];

const CHART_DATA = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const PIE_DATA = [
  { name: 'Technical', value: 45 },
  { name: 'Strategic', value: 30 },
  { name: 'Administrative', value: 25 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'projects' | 'docs' | 'ai'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Good morning. I have summarized your current state and prioritized three high-impact actions for today. How can I assist with your digital transformation goals?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are an elite Executive Assistant specialized in digital transformation, technical project management, and high-level administrative strategy. Your tone is concise, professional, and action-oriented. Always provide a 'Current State' summary and suggest actionable next steps.",
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Nexus</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-semibold">Executive Suite</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="Action Items" 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
          />
          <NavItem 
            icon={<Layers size={20} />} 
            label="Projects" 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')} 
          />
          <NavItem 
            icon={<FileText size={20} />} 
            label="Documentation" 
            active={activeTab === 'docs'} 
            onClick={() => setActiveTab('docs')} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="AI Assistant" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">System Health</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full w-[92%]"></div>
            </div>
            <p className="text-[10px] text-blue-700 mt-2 font-medium">92% Operational Efficiency</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-[#64748B]">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search strategy, tasks, or documentation..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-64"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-[#64748B] hover:text-[#1E293B] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>
            <div className="h-8 w-px bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">Executive User</p>
                <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">Digital Lead</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                EU
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Welcome Section */}
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">Strategic Overview</h2>
                    <p className="text-[#64748B]">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Calendar size={16} />
                      Schedule
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Current State Summary */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-600">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-blue-600" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-blue-900">Current State Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Status</p>
                      <p className="text-sm font-medium">Q1 Transformation Phase: <span className="text-emerald-600 font-bold">On Track</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Critical Path</p>
                      <p className="text-sm font-medium">API Integration & Security Audit</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Next Milestone</p>
                      <p className="text-sm font-medium">Cloud Migration Phase 2 (April 15)</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<Zap className="text-blue-600" />} label="Efficiency" value="94.2%" trend="+2.4%" />
                  <StatCard icon={<BarChart3 className="text-emerald-600" />} label="Project Velocity" value="8.4" trend="+0.8" />
                  <StatCard icon={<CheckSquare className="text-amber-600" />} label="Tasks Completed" value="124" trend="+12" />
                  <StatCard icon={<Clock className="text-indigo-600" />} label="Avg. Response" value="14m" trend="-2m" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">Transformation Progress</h3>
                      <select className="bg-[#F8FAFC] border-[#E2E8F0] rounded-lg text-xs font-semibold p-2 outline-none">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Resource Allocation</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PIE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-4">
                      {PIE_DATA.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-sm font-medium text-[#64748B]">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Tasks */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">High-Priority Actions</h3>
                      <button onClick={() => setActiveTab('tasks')} className="text-blue-600 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {tasks.filter(t => t.priority === 'high').slice(0, 3).map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-transparent hover:border-blue-100 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              task.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                            )}>
                              {task.status === 'completed' ? <CheckSquare size={18} /> : <Zap size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">{task.title}</p>
                              <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                                <Clock size={12} />
                                Due {format(new Date(task.dueDate), 'MMM d')}
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-[#CBD5E1]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Projects */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">Active Projects</h3>
                      <button onClick={() => setActiveTab('projects')} className="text-blue-600 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                      {PROJECTS.map(project => (
                        <div key={project.id}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold">{project.name}</span>
                            <span className="text-xs font-bold text-blue-600">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-[#64748B] mt-2 uppercase tracking-wider font-semibold">Last update: {project.lastUpdate}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col max-w-4xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Cpu size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Nexus Intelligence</h3>
                      <p className="text-xs text-blue-100 opacity-80">Online • Digital Transformation Specialist</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Settings size={18} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xs",
                        msg.role === 'assistant' ? "bg-blue-600" : "bg-[#1E293B]"
                      )}>
                        {msg.role === 'assistant' ? <Zap size={14} /> : <User size={14} />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl shadow-sm",
                        msg.role === 'assistant' ? "bg-white border border-[#E2E8F0] text-[#1E293B]" : "bg-blue-600 text-white"
                      )}>
                        <div className="prose prose-sm max-w-none prose-slate">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        <p className={cn(
                          "text-[10px] mt-2 font-medium opacity-60",
                          msg.role === 'user' ? "text-right" : ""
                        )}>
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4 max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 shrink-0 flex items-center justify-center text-white">
                        <Zap size={14} />
                      </div>
                      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-6 border-t border-[#E2E8F0] bg-white">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about project status, technical requirements, or scheduling..." 
                      className="flex-1 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <QuickAction label="Summarize Projects" onClick={() => setInput("Summarize my current projects")} />
                    <QuickAction label="Today's Priorities" onClick={() => setInput("What are my top priorities for today?")} />
                    <QuickAction label="Technical Audit" onClick={() => setInput("Draft a technical audit checklist")} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight">Action Items</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Zap size={16} />
                    New Task
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {tasks.map(task => (
                        <tr key={task.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold">{task.title}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                              {task.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                              task.priority === 'high' ? "bg-red-100 text-red-600" : 
                              task.priority === 'medium' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                            )}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                task.status === 'completed' ? "bg-emerald-500" : 
                                task.status === 'in-progress' ? "bg-blue-500" : "bg-[#CBD5E1]"
                              )}></div>
                              <span className="text-xs font-medium capitalize">{task.status.replace('-', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-[#64748B] font-medium">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'docs' && (
              <motion.div 
                key="docs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full"
              >
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-bold text-lg mb-4">Documentation</h3>
                  <div className="space-y-1">
                    <DocNavItem label="API Integration Guide" active={true} />
                    <DocNavItem label="Security Protocols" active={false} />
                    <DocNavItem label="Cloud Migration Strategy" active={false} />
                    <DocNavItem label="Legacy System Audit" active={false} />
                  </div>
                </div>
                <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm overflow-y-auto max-h-[calc(100vh-200px)]">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{`
# Technical Requirements: Q3 API Integration

**Status:** Draft | **Priority:** High | **Owner:** Executive Assistant

## 1. Executive Summary
This document outlines the technical requirements for the upcoming Q3 API integration phase, focusing on modularity, security, and high-performance data throughput.

## 2. Core Objectives
- Implement OAuth 2.0 authentication flow with PKCE.
- Achieve < 200ms latency for all primary endpoints.
- Ensure 99.9% uptime for the integration layer.

## 3. Technical Stack
| Component | Technology |
| :--- | :--- |
| Runtime | Node.js 20.x |
| Framework | Express with TypeScript |
| Database | Firestore (Enterprise) |
| Monitoring | Prometheus & Grafana |

## 4. Security Protocols
All requests must be signed with a valid JWT. We will implement rate limiting at the gateway level (1000 req/min per client).

## 5. Next Steps
1. [ ] Finalize schema definitions.
2. [ ] Conduct security audit of the auth layer.
3. [ ] Deploy staging environment.
                    `}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight">Project Roadmap</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-bold text-[#64748B]">Timeline</button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Kanban</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {PROJECTS.map((project, idx) => (
                    <div key={project.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{project.name}</h3>
                          <p className="text-xs text-[#64748B] mt-1">Strategic Initiative • Phase {idx + 1}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          project.status === 'active' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600"
                        )}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#64748B]">Progress</span>
                          <span className="text-blue-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-blue-600 h-2.5 rounded-full"
                          ></motion.div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
                          <div>
                            <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-widest mb-1">Start Date</p>
                            <p className="text-sm font-bold">Jan 15, 2026</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-widest mb-1">Target Date</p>
                            <p className="text-sm font-bold">Jun 30, 2026</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-widest mb-1">Velocity</p>
                            <p className="text-sm font-bold text-emerald-600">High</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
          : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  const isNeutral = !trend.startsWith('+') && !trend.startsWith('-');

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-[#F8FAFC] rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full",
          isPositive ? "bg-emerald-50 text-emerald-600" : 
          isNeutral ? "bg-gray-50 text-gray-600" : "bg-red-50 text-red-600"
        )}>
          {trend}
        </span>
      </div>
      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[10px] font-bold text-[#64748B] hover:border-blue-300 hover:text-blue-600 transition-all uppercase tracking-wider"
    >
      {label}
    </button>
  );
}

function DocNavItem({ label, active }: { label: string, active: boolean }) {
  return (
    <button className={cn(
      "w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all",
      active ? "bg-blue-50 text-blue-600" : "text-[#64748B] hover:bg-gray-50 hover:text-[#1E293B]"
    )}>
      {label}
    </button>
  );
}
