"use client";

import { useRef, useState } from "react";
import Cookies from "js-cookie";
import { post } from "../services/pyApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music2, Loader2, Waves, BarChart3, CircleHelp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const headersRef = useRef<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    headersRef.current = e.target.value;
  };

  const handleSubmit = async () => {
    if (!headersRef.current.trim()) {
      setError("Please enter request headers.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await post("/create-new-user", { "request_headers": headersRef.current });
      if (response && response.success === true) {
        Cookies.set("uid", response.uid, { expires: 30 });
        onLoginSuccess();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to log in. Please try again, ensure valid headers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-900 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-red-500/40 via-red-900/20 to-transparent pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute rounded-full mix-blend-overlay animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 600 + 400}px`,
              height: `${Math.random() * 600 + 400}px`,
              background: `radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 70%)`,
              animation: `pulse ${Math.random() * 8 + 6}s infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <div
            key={`fg-${i}`}
            className="absolute rounded-full mix-blend-screen"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              background: `radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.1) 60%)`,
              animation: `float ${Math.random() * 10 + 15}s infinite linear`,
              animationDelay: `${Math.random() * -15}s`
            }}
          />
        ))}
      </div>
  
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12">
        <div className="relative z-10 text-center space-y-8">
          <div className="flex justify-center">
            <Music2 className="h-20 w-20 text-red-500/90" />
          </div>
          <h1 className="text-6xl font-bold text-zinc-100 tracking-tight">
            TuneOracle
          </h1>
          <p className="text-xl text-zinc-300 max-w-md">
            Discover the story behind your YouTube Music journey
          </p>
          <div className="flex gap-8 justify-center mt-12">
            <div className="text-center">
              <Waves className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-zinc-300">Pattern Analysis</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-zinc-300">Listening Insights</p>
            </div>
          </div>
        </div>
      </div>
  
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <Card className="w-full max-w-xl bg-white/5 backdrop-blur-lg border-white/10 relative z-10">
          <CardContent className="p-8 space-y-6">
            <div className="lg:hidden text-center mb-8">
              <Music2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-zinc-100 mb-2">TuneOracle</h1>
              <p className="text-zinc-300">Discover your music patterns</p>
            </div>
  
            <div className="space-y-4">
                <div className="flex items-center mb-2">
                <label className="block text-lg font-medium text-zinc-200">
                  Enter YouTube Music Request Headers
                </label>
                    
                <Button className="bg-transparent p-3 hover:bg-transparent" onClick={() => {setIsModalOpen(true)}}>
                  <CircleHelp className="text-white w-5"/>
                </Button>
                </div>
              <Textarea
                className="min-h-[120px] bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-400/50 resize-none text-sm focus:border-red-500/50 transition-colors duration-200"
                placeholder="Paste your YouTube Music request headers here to begin your journey..."
                defaultValue={headersRef.current}
                onChange={handleInputChange}
              />
              <p className="text-sm text-zinc-400">
                Your headers help us securely access your music listening data
              </p>
            </div>
  
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
  
            <Button 
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 mt-4"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Music Data...
                </>
              ) : (
                'Reveal My Music Journey'
              )}
            </Button>
  
            <p className="text-sm text-zinc-500 text-center mt-4">
              Your data is processed securely and privately
            </p>
          </CardContent>
        </Card>
      </div>
  
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0%, 0%) rotate(0deg); }
          33% { transform: translate(10%, 10%) rotate(120deg); }
          66% { transform: translate(-10%, 5%) rotate(240deg); }
          100% { transform: translate(0%, 0%) rotate(360deg); }
        }
      `}</style>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 shadow-xl p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
              How to Get Your YouTube Music Headers
              <DialogClose asChild>
                <Button variant="ghost" className="p-2">
                  <X className="w-6 h-6 text-zinc-400 hover:bg-transparent" />
                </Button>
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              YouTube does not allow third-party sites to access user data even with OAuth, hence we require request headers to get around it. <br />              Follow these steps to copy your request headers:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-zinc-300 text-sm">
            <p className="text-red-400 font-semibold">🔹 Step 1: Open Developer Tools</p>
            <ul className="list-disc list-inside ml-4">
              <li>Open a new tab in your browser.</li>
              <li>Press <strong>Ctrl + Shift + I</strong> (or <strong>Cmd + Option + I</strong> on Mac) to open Developer Tools.</li>
              <li>Click the <span className="text-red-500 font-semibold">Network</span> tab.</li>
            </ul>

            <p className="text-red-400 font-semibold">🔹 Step 2: Find a Request</p>
            <ul className="list-disc list-inside ml-4">
              <li>Go to <a href="https://music.youtube.com" target="_blank" className="text-blue-400 underline">YouTube Music</a> and ensure you are logged in.</li>
              <li>In the <span className="text-red-500 font-semibold">Network</span> tab, search for <span className="text-red-400 font-semibold">browse</span> in the search bar.</li>
              <li>Look for a <strong>POST request</strong> with <strong>Status 200</strong> and Domain <strong>music.youtube.com</strong>.</li>
            </ul>

            <p className="text-red-400 font-semibold">🔹 Step 3: Copy the Request Headers</p>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Firefox:</strong> Right-click the request &gt; <span className="text-red-400">Copy</span> &gt; <span className="text-red-400">Copy Request Headers</span>.</li>
              <li><strong>Chrome:</strong> Click the request, scroll to the <span className="text-red-400">Request Headers</span> section, and copy everything.</li>
            </ul>

            <p className="text-green-400 font-semibold">✅ Done! Paste the copied headers above to proceed.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  
}