import React from 'react';
import { Project, ActivityLog, UserProfile } from '../types';
import { Clock, CheckSquare, Layers, Coins, Plus, Calendar, FileText, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface OverviewProps {
  projects: Project[];
  activities: ActivityLog[];
  userProfile: UserProfile;
  onNavigate: (route: string) => void;
  onSelectProject: (project: Project) => void;
  onAddCredits: () => void;
}

export default function Overview({ projects, activities, userProfile, onNavigate, onSelectProject, onAddCredits }: OverviewProps) {
  // Compute dashboard metrics
  const activeProjects = projects.filter(p => p.status === 'completed');
  const totalGenerations = activeProjects.reduce((acc, p) => acc + p.formatsSelected.length, 0);
  const timeSavedMinutes = totalGenerations * 45; // Estimate 45 mins saved per output piece
  const timeSavedHours = (timeSavedMinutes / 60).toFixed(1);

  // Format statistics
  const formatCounts: Record<string, number> = {};
  activeProjects.forEach(p => {
    p.formatsSelected.forEach(f => {
      formatCounts[f] = (formatCounts[f] || 0) + 1;
    });
  });

  const formatList = Object.entries(formatCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = formatList[0]?.[1] || 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {userProfile.displayName}!</h1>
          <p className="text-slate-400 text-sm mt-1">Unlock your content's true potential today. You have {userProfile.credits} credits left.</p>
        </div>
        <button 
          onClick={() => onNavigate('new-project')}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-950/20 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Time Saved</p>
            <p className="text-2xl font-extrabold text-white mt-1">{timeSavedHours} hrs</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Generations</p>
            <p className="text-2xl font-extrabold text-white mt-1">{totalGenerations}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Projects</p>
            <p className="text-2xl font-extrabold text-white mt-1">{projects.length}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
            <Coins className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Credits Left</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white mt-1">{userProfile.credits}</span>
              <span className="text-slate-500 text-xs">/ {userProfile.credits + userProfile.creditsUsed} used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recent Projects & Format Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Projects</h2>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-orange-400 hover:text-orange-300 text-xs font-semibold flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                <FileText className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No projects forged yet</p>
                <button 
                  onClick={() => onNavigate('new-project')}
                  className="mt-4 bg-orange-600 hover:bg-orange-500 text-white font-medium px-4 py-2 rounded-lg text-xs"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {projects.slice(0, 4).map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="py-4 flex items-center justify-between hover:bg-slate-800/40 px-3 rounded-lg cursor-pointer transition-all duration-150 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-orange-400 transition-colors truncate">
                          {project.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          project.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          project.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="capitalize">{project.sourceType}</span>
                        <span>•</span>
                        <span>{project.tone}</span>
                        <span>•</span>
                        <span>{project.formatsSelected.length} formats</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Format Breakdown */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-lg font-bold text-white tracking-tight mb-6">Format Breakdown</h2>
            {formatList.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">No complete formats generated yet.</p>
            ) : (
              <div className="space-y-4">
                {formatList.map(([format, count]) => {
                  const percentage = Math.round((count / maxCount) * 100);
                  return (
                    <div key={format} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{format}</span>
                        <span className="text-slate-400">{count} {count === 1 ? 'piece' : 'pieces'}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Credits Card & Activity Feed */}
        <div className="space-y-8">
          {/* Plan/Credits Card */}
          <div className="bg-gradient-to-br from-slate-900 to-orange-950/20 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between h-fit relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all duration-300"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                  {userProfile.tier} Plan
                </span>
                <Coins className="h-5 w-5 text-orange-500" />
              </div>
              
              <h3 className="text-lg font-bold text-white mt-4">Credit Balance</h3>
              <p className="text-3xl font-extrabold text-white mt-2">{userProfile.credits} <span className="text-slate-400 text-sm font-normal">Credits</span></p>
              
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${(userProfile.credits / (userProfile.credits + userProfile.creditsUsed)) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Credits renew on the 1st of every month</p>
            </div>

            <button 
              onClick={onAddCredits}
              className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-orange-950/20"
            >
              Get More Credits
            </button>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex-1">
            <h2 className="text-lg font-bold text-white tracking-tight mb-6">Activity Feed</h2>
            {activities.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">No recent activities.</p>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex gap-3 items-start text-xs">
                    <div className="mt-1">
                      {act.type.includes('completed') && <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>}
                      {act.type.includes('failed') && <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>}
                      {act.type.includes('voice') && <div className="w-2 h-2 rounded-full bg-orange-500 mt-1"></div>}
                      {act.type.includes('credits') && <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 font-medium">{act.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
