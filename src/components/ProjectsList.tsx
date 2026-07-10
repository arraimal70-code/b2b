import React from 'react';
import { Project } from '../types';
import { FileText, ArrowRight, Plus, Search, Calendar, RefreshCw, AlertTriangle, Layers } from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (route: string) => void;
}

export default function ProjectsList({ projects, onSelectProject, onNavigate }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sourceFilter, setSourceFilter] = React.useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || project.sourceType === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and access all of your generated content assets.</p>
        </div>
        <button 
          onClick={() => onNavigate('new-project')}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-950/20 w-fit"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 text-slate-400 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-slate-950 text-slate-400 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
        >
          <option value="all">All Sources</option>
          <option value="youtube">YouTube Video</option>
          <option value="file">Uploaded File</option>
          <option value="transcript">Pasted Transcript</option>
        </select>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Layers className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-slate-300 font-semibold text-sm">No matching projects found</h3>
          <p className="text-slate-500 text-xs mt-1">Try adjusting your filters or search query.</p>
          <button 
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSourceFilter('all'); }}
            className="mt-4 text-orange-400 hover:text-orange-300 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    project.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    project.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-4 border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-1.5 capitalize">
                    <span>Source:</span>
                    <span className="text-slate-300 font-semibold">{project.sourceType}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span>Tone:</span>
                    <span className="text-slate-300 font-semibold">{project.tone}</span>
                  </div>
                </div>

                {project.errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[11px] text-red-400 mt-4 flex gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{project.errorMsg}</span>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Requested Formats:</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.formatsSelected.map(f => (
                      <span key={f} className="text-[10px] bg-slate-950 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-orange-400 hover:text-orange-300 text-xs font-semibold flex items-center gap-1">
                  View outputs <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
