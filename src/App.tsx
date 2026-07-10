import React, { useState, useEffect } from 'react';
import { 
  Project, 
  BrandVoice, 
  UserProfile, 
  ActivityLog, 
  SourceType 
} from './types';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut 
} from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs 
} from 'firebase/firestore';

// Component Imports
import LandingPage from './components/LandingPage';
import AppShell from './components/AppShell';
import Overview from './components/Overview';
import NewProject from './components/NewProject';
import ProjectsList from './components/ProjectsList';
import ProjectDetails from './components/ProjectDetails';
import BrandVoiceList from './components/BrandVoiceList';
import AIQuality from './components/AIQuality';
import CaseStudy from './components/CaseStudy';
import Billing from './components/Billing';
import Settings from './components/Settings';

// Demo Data Imports
import { 
  SEEDED_PROJECTS, 
  SEEDED_BRAND_VOICES, 
  SEEDED_ACTIVITIES 
} from './lib/demoData';

import { Sparkles, ShieldAlert, ArrowRight, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // App routing
  const [currentRoute, setCurrentRoute] = useState<string>('landing'); // landing, overview, projects, brand-voice, etc.
  
  // Navigation stack
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Core collections
  const [projects, setProjects] = useState<Project[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Simulation fallback logins
  const [isSandbox, setIsSandbox] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsSandbox(false);
        await syncUserProfile(firebaseUser.uid, firebaseUser.email || 'creator@contentforge.in', firebaseUser.displayName || 'Indian Creator');
        setCurrentRoute('overview');
      } else {
        // Only reset if we are not in sandbox mode
        if (!isSandbox) {
          setUser(null);
          setUserProfile(null);
          setCurrentRoute('landing');
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [isSandbox]);

  // Synchronize collections when user changes
  useEffect(() => {
    if (!user && !isSandbox) {
      setProjects([]);
      setBrandVoices([]);
      setActivities([]);
      return;
    }

    const userId = user?.uid || 'demo-user-id';

    // 1. Listen for projects
    const qProjects = query(collection(db, "projects"), where("userId", "==", userId));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      // Sort by creation date desc
      projs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProjects(projs);
    }, (error) => {
      console.warn("Firestore projects listener warning:", error);
    });

    // 2. Listen for brand voices
    const qVoices = query(collection(db, "brandVoices"), where("userId", "==", userId));
    const unsubVoices = onSnapshot(qVoices, (snapshot) => {
      const voices: BrandVoice[] = [];
      snapshot.forEach((doc) => {
        voices.push({ id: doc.id, ...doc.data() } as BrandVoice);
      });
      setBrandVoices(voices);
    }, (error) => {
      console.warn("Firestore brandVoices listener warning:", error);
    });

    // 3. Listen for activity logs
    const qActivities = query(collection(db, "activities"), where("userId", "==", userId));
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      const acts: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        acts.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });
      acts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(acts);
    }, (error) => {
      console.warn("Firestore activities listener warning:", error);
    });

    return () => {
      unsubProjects();
      unsubVoices();
      unsubActivities();
    };
  }, [user, isSandbox]);

  // Sync user profile
  const syncUserProfile = async (uid: string, email: string, name: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        const initialProfile: UserProfile = {
          id: uid,
          email,
          displayName: name,
          credits: 50,
          creditsUsed: 0,
          tier: 'Free',
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, initialProfile);
        setUserProfile(initialProfile);

        // Seed some starter brand voices and projects to make it beautiful
        await seedFirestoreStarterData(uid);
      }
    } catch (e) {
      console.error("Error syncing user profile:", e);
      // Fallback local representation to make the app usable even if firestore fails
      setUserProfile({
        id: uid,
        email,
        displayName: name,
        credits: 50,
        creditsUsed: 0,
        tier: 'Free',
        createdAt: new Date().toISOString()
      });
    }
  };

  // Seed Firestore Starter Data
  const seedFirestoreStarterData = async (uid: string) => {
    try {
      // Seed brand voices
      for (const bv of SEEDED_BRAND_VOICES) {
        await setDoc(doc(db, "brandVoices", `${bv.id}-${uid}`), {
          ...bv,
          id: `${bv.id}-${uid}`,
          userId: uid
        });
      }

      // Seed projects
      for (const proj of SEEDED_PROJECTS) {
        await setDoc(doc(db, "projects", `${proj.id}-${uid}`), {
          ...proj,
          id: `${proj.id}-${uid}`,
          userId: uid,
          brandVoiceId: proj.brandVoiceId ? `${proj.brandVoiceId}-${uid}` : null
        });
      }

      // Seed activities
      for (const act of SEEDED_ACTIVITIES) {
        await setDoc(doc(db, "activities", `${act.id}-${uid}`), {
          ...act,
          id: `${act.id}-${uid}`,
          userId: uid
        });
      }
    } catch (e) {
      console.error("Error seeding initial starter data:", e);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Popup sign-in blocked or failed:", error);
      setAuthError(
        "Standard OAuth popups are sometimes blocked by iframe sandboxes. Please use the Instant Guest Sandbox Access option to explore ContentForge instantly."
      );
    }
  };

  // Handle email registration or login
  const handleEmailAuth = async (isSignUp: boolean) => {
    setAuthError(null);
    if (!authEmail || !authPassword) {
      setAuthError("Please fill out both email and password.");
      return;
    }
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setShowAuthModal(false);
    } catch (error: any) {
      setAuthError(error.message || "Email authentication failed.");
    }
  };

  // Instant Guest Access / Sandbox Mode
  const handleInstantGuestLogin = async () => {
    setLoading(true);
    setIsSandbox(true);
    setUser({
      uid: 'demo-user-id',
      email: 'creator@contentforge.in',
      displayName: 'Indian Creator'
    });
    
    // Seed/mock the profile
    setUserProfile({
      id: 'demo-user-id',
      email: 'creator@contentforge.in',
      displayName: 'Indian Creator',
      credits: 45,
      creditsUsed: 5,
      tier: 'Pro',
      createdAt: new Date().toISOString()
    });

    // Populate sandbox lists with pre-seeded values directly
    setProjects(SEEDED_PROJECTS);
    setBrandVoices(SEEDED_BRAND_VOICES);
    setActivities(SEEDED_ACTIVITIES);

    setCurrentRoute('overview');
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    if (isSandbox) {
      setIsSandbox(false);
      setUser(null);
      setUserProfile(null);
      setCurrentRoute('landing');
      setLoading(false);
    } else {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Logout error", e);
      }
    }
  };

  // Generate Content call (Server proxy)
  const handleGenerateProject = async (projectData: {
    title: string;
    sourceType: SourceType;
    sourceUrl?: string;
    sourceText?: string;
    fileBase64?: string;
    fileMimeType?: string;
    fileName?: string;
    tone: string;
    brandVoiceId: string | null;
    formatsSelected: string[];
  }) => {
    const userId = user?.uid || 'demo-user-id';
    
    // Step 1: Create local project model in firestore (or local state in sandbox)
    const newProjectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newProjectId,
      userId,
      title: projectData.title,
      sourceType: projectData.sourceType,
      sourceUrl: projectData.sourceUrl,
      sourceText: projectData.sourceText,
      fileName: projectData.fileName,
      tone: projectData.tone,
      brandVoiceId: projectData.brandVoiceId,
      formatsSelected: projectData.formatsSelected,
      status: 'queued',
      outputs: {},
      createdAt: new Date().toISOString()
    };

    // Optimistically update collections
    if (isSandbox) {
      setProjects(prev => [newProject, ...prev]);
    } else {
      try {
        await setDoc(doc(db, "projects", newProjectId), newProject);
      } catch (e) {
        console.error("Firestore write failed, falling back local.", e);
      }
    }

    // Select this project so user is taken directly to processing skeleton page
    setSelectedProject(newProject);
    setCurrentRoute('project-details');

    // Update Project Status to Processing
    updateProjectStatus(newProjectId, 'processing');

    // Log Activity
    logUserActivity(`Created and queued project '${projectData.title}'`, 'project_created');

    // Find custom brand voice details if applicable
    const activeVoice = brandVoices.find(bv => bv.id === projectData.brandVoiceId);

    // Call server API route
    try {
      const response = await fetch('/api/process-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectData.title,
          sourceType: projectData.sourceType,
          sourceUrl: projectData.sourceUrl,
          sourceText: projectData.sourceText,
          fileBase64: projectData.fileBase64,
          fileMimeType: projectData.fileMimeType,
          tone: projectData.tone,
          formatsSelected: projectData.formatsSelected,
          brandVoice: activeVoice || null
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Generation succeeded! Save results
        updateProjectResults(newProjectId, result.outputs, 'completed');
        
        // Deduct credits on User Profile
        deductUserCredits(projectData.formatsSelected.length);

        // Log Activity
        logUserActivity(`Successfully forged '${projectData.title}'`, 'project_completed');
      } else {
        // Generation failed on server
        const errStr = result.error || "The AI model returned an empty copy. Please double check your input details or try again.";
        updateProjectResults(newProjectId, {}, 'failed', errStr);

        // Log Activity
        logUserActivity(`Forging failed for '${projectData.title}'`, 'project_failed');
      }

    } catch (networkError: any) {
      // Handle server crash, timeout or general offline error
      console.error("Network generation error:", networkError);
      const errMsg = "Request timed out or offline. This typically occurs when large audio/video files exceed model buffers or API limits. Please retry with a shorter excerpt.";
      updateProjectResults(newProjectId, {}, 'failed', errMsg);

      // Log Activity
      logUserActivity(`Network exception for '${projectData.title}'`, 'project_failed');
    }
  };

  // Helper: Update project status
  const updateProjectStatus = async (projectId: string, status: 'queued' | 'processing' | 'completed' | 'failed') => {
    if (isSandbox) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
      setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, status } : prev);
    } else {
      try {
        await updateDoc(doc(db, "projects", projectId), { status });
      } catch (e) {
        console.error("Firestore update status failed.", e);
      }
    }
  };

  // Helper: Update project results
  const updateProjectResults = async (
    projectId: string, 
    outputs: Record<string, string>, 
    status: 'completed' | 'failed',
    errorMsg?: string
  ) => {
    if (isSandbox) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, outputs, status, errorMsg } : p));
      setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, outputs, status, errorMsg } : prev);
    } else {
      try {
        await updateDoc(doc(db, "projects", projectId), {
          outputs,
          status,
          errorMsg: errorMsg || null
        });
      } catch (e) {
        console.error("Firestore update results failed.", e);
      }
    }
  };

  // Helper: Deduct credits
  const deductUserCredits = async (amount: number) => {
    if (!userProfile) return;
    const nextCredits = Math.max(0, userProfile.credits - amount);
    const nextUsed = userProfile.creditsUsed + amount;
    
    const updatedProfile = { 
      ...userProfile, 
      credits: nextCredits,
      creditsUsed: nextUsed
    };

    setUserProfile(updatedProfile);

    if (!isSandbox) {
      try {
        await updateDoc(doc(db, "users", userProfile.id), {
          credits: nextCredits,
          creditsUsed: nextUsed
        });
      } catch (e) {
        console.error("Firestore update credits failed.", e);
      }
    }
  };

  // Helper: Log activities
  const logUserActivity = async (
    title: string, 
    type: 'project_created' | 'project_completed' | 'project_failed' | 'brand_voice_created' | 'credits_topped_up'
  ) => {
    const userId = user?.uid || 'demo-user-id';
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId,
      title,
      type,
      timestamp: new Date().toISOString()
    };

    if (isSandbox) {
      setActivities(prev => [newLog, ...prev]);
    } else {
      try {
        await setDoc(doc(db, "activities", newLog.id), newLog);
      } catch (e) {
        console.error("Firestore update activities failed.", e);
      }
    }
  };

  // Create Brand Voice
  const handleCreateBrandVoice = async (voiceData: Omit<BrandVoice, 'id' | 'userId' | 'createdAt'>) => {
    const userId = user?.uid || 'demo-user-id';
    const newVoiceId = `bv-${Date.now()}`;
    const newVoice: BrandVoice = {
      id: newVoiceId,
      userId,
      ...voiceData,
      createdAt: new Date().toISOString()
    };

    if (isSandbox) {
      setBrandVoices(prev => [...prev, newVoice]);
    } else {
      try {
        await setDoc(doc(db, "brandVoices", newVoiceId), newVoice);
      } catch (e) {
        console.error("Firestore create brand voice failed.", e);
      }
    }

    logUserActivity(`Created brand voice profile '${voiceData.name}'`, 'brand_voice_created');
  };

  // Delete Brand Voice
  const handleDeleteBrandVoice = async (id: string) => {
    if (isSandbox) {
      setBrandVoices(prev => prev.filter(bv => bv.id !== id));
    } else {
      try {
        await deleteDoc(doc(db, "brandVoices", id));
      } catch (e) {
        console.error("Firestore delete brand voice failed.", e);
      }
    }
  };

  // Update Project Outputs Inline
  const handleUpdateProjectOutputs = async (projectId: string, updatedOutputs: Record<string, string>) => {
    if (isSandbox) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, outputs: updatedOutputs } : p));
      setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, outputs: updatedOutputs } : prev);
    } else {
      try {
        await updateDoc(doc(db, "projects", projectId), { outputs: updatedOutputs });
      } catch (e) {
        console.error("Firestore update project outputs failed.", e);
      }
    }
  };

  // Regenerate Project
  const handleRegenerateProject = (project: Project) => {
    handleGenerateProject({
      title: project.title,
      sourceType: project.sourceType,
      sourceUrl: project.sourceUrl,
      sourceText: project.sourceText,
      tone: project.tone,
      brandVoiceId: project.brandVoiceId,
      formatsSelected: project.formatsSelected
    });
  };

  // Select Plan (Pricing Page)
  const handleSelectPlan = async (tier: 'Free' | 'Pro' | 'Ultimate', price: number) => {
    if (!userProfile) return;
    const nextCredits = tier === 'Pro' ? 150 : tier === 'Ultimate' ? 500 : 10;
    const updated = {
      ...userProfile,
      tier,
      credits: nextCredits
    };
    setUserProfile(updated);

    if (!isSandbox) {
      try {
        await updateDoc(doc(db, "users", userProfile.id), {
          tier,
          credits: nextCredits
        });
      } catch (e) {
        console.error("Firestore plan update failed.", e);
      }
    }

    logUserActivity(`Upgraded account to ${tier} Plan`, 'credits_topped_up');
  };

  // Top Up Credits
  const handleTopUpCredits = async () => {
    if (!userProfile) return;
    const nextCredits = userProfile.credits + 50;
    const updated = {
      ...userProfile,
      credits: nextCredits
    };
    setUserProfile(updated);

    if (!isSandbox) {
      try {
        await updateDoc(doc(db, "users", userProfile.id), {
          credits: nextCredits
        });
      } catch (e) {
        console.error("Firestore top up credits failed.", e);
      }
    }

    logUserActivity(`Topped up 50 credits to balance`, 'credits_topped_up');
  };

  // Navigation router
  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    setSelectedProject(null);
  };

  const handleSelectProjectAndGo = (project: Project) => {
    setSelectedProject(project);
    setCurrentRoute('project-details');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
        </div>
        <p className="text-xs text-slate-500 mt-4 font-bold tracking-widest uppercase">ContentForge AI</p>
      </div>
    );
  }

  // If route is landing (unauthenticated)
  if (currentRoute === 'landing' && !userProfile) {
    return (
      <>
        <LandingPage 
          onStart={() => setShowAuthModal(true)} 
          onGoToDashboard={() => setCurrentRoute('overview')}
          isLoggedIn={!!userProfile}
        />

        {/* Modal Auth */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setShowAuthModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 relative z-10 animate-scale-up">
              <div className="text-center">
                <div className="bg-orange-600 p-2.5 rounded-lg text-white w-fit mx-auto mb-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Join ContentForge AI</h3>
                <p className="text-xs text-slate-400 mt-1">Transform long form long-form into rapid viral social hooks.</p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Developer Bypass Sandbox Row */}
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Recommended for Preview Evaluation:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Iframe cookies and popup windows can be blocked by browser sandbox settings. We recommend using our **Instant Guest Sandbox Access** for instantaneous evaluation.
                </p>
                <button
                  onClick={handleInstantGuestLogin}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
                >
                  Instant Guest Sandbox Access
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-slate-500 text-xs">or sign in with credentials</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Standard Google Login */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
              >
                Continue with Google (OAuth Popup)
              </button>

              {/* Email Fields */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="creator@contentforge.in"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleEmailAuth(false)}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => handleEmailAuth(true)}
                    className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/20 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Active Authenticated App shell content views
  return (
    <AppShell 
      currentRoute={currentRoute} 
      onNavigate={handleNavigate} 
      userProfile={userProfile!} 
      onLogout={handleLogout}
    >
      {/* Overview Dashboard */}
      {currentRoute === 'overview' && (
        <Overview 
          projects={projects}
          activities={activities}
          userProfile={userProfile!}
          onNavigate={handleNavigate}
          onSelectProject={handleSelectProjectAndGo}
          onAddCredits={handleTopUpCredits}
        />
      )}

      {/* New Project Form */}
      {currentRoute === 'new-project' && (
        <NewProject 
          brandVoices={brandVoices}
          onGenerate={handleGenerateProject}
          credits={userProfile?.credits || 0}
        />
      )}

      {/* Projects List view */}
      {currentRoute === 'projects' && (
        <ProjectsList 
          projects={projects}
          onSelectProject={handleSelectProjectAndGo}
          onNavigate={handleNavigate}
        />
      )}

      {/* Project details screen */}
      {currentRoute === 'project-details' && selectedProject && (
        <ProjectDetails 
          project={selectedProject}
          brandVoices={brandVoices}
          onBack={() => handleNavigate('projects')}
          onUpdateOutputs={handleUpdateProjectOutputs}
          onRegenerate={handleRegenerateProject}
        />
      )}

      {/* Brand Voice CRUD interface */}
      {currentRoute === 'brand-voice' && (
        <BrandVoiceList 
          brandVoices={brandVoices}
          onCreateVoice={handleCreateBrandVoice}
          onDeleteVoice={handleDeleteBrandVoice}
        />
      )}

      {/* AI quality evaluations analytics */}
      {currentRoute === 'ai-quality' && (
        <AIQuality projects={projects} />
      )}

      {/* Case studies of Indian creators */}
      {currentRoute === 'case-study' && (
        <CaseStudy />
      )}

      {/* Billing plans */}
      {currentRoute === 'billing' && (
        <Billing 
          userProfile={userProfile!}
          onSelectPlan={handleSelectPlan}
          onTopUpCredits={handleTopUpCredits}
        />
      )}

      {/* Settings section */}
      {currentRoute === 'settings' && (
        <Settings 
          userProfile={userProfile!} 
          onLogout={handleLogout} 
        />
      )}
    </AppShell>
  );
}
