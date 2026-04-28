"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, FileText, MapPin, CreditCard, Building2, AlertCircle, Info, Send, Trash2, Globe, ChevronDown, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";
import { translations } from "./translations";

import { Timeline } from "./components/Timeline";
import { Steps } from "./components/Steps";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

type Tab = "chat" | "timeline" | "steps";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia"];

function ChatMessage({ message }: { message: Message }) {
  const isBot = message.type === "bot";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] sm:max-w-[70%]",
        isBot ? "order-2" : "order-1"
      )}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isBot 
              ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-sm" 
              : "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm"
          )}
        >
          <div className={cn(
            "text-sm leading-relaxed",
            isBot ? "text-gray-800 dark:text-gray-100" : "text-white"
          )}>
            {isBot ? (
                <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-sm">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ) : (
                <span className="whitespace-pre-wrap">{message.content}</span>
            )}
          </div>
        </motion.div>
        
        <div className={cn(
          "text-xs mt-1.5 text-gray-400",
          isBot ? "text-left" : "text-right"
        )}>
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md order-2">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all shadow-sm hover:shadow-md group"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 dark:group-hover:from-orange-800 dark:group-hover:to-orange-700 transition-colors">
        <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
        {label}
      </span>
    </motion.button>
  );
}

function IndianVoterAssistant() {
  const [activeTab, setActiveTab] = React.useState<Tab>("chat");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");
  const [language, setLanguage] = React.useState("English");
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendStart = React.useCallback(async (session: string, lang: string) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: session, message: '/start', language: lang })
        });
        const data = await res.json();
        if (!session || session !== data.sessionId) {
            localStorage.setItem('votersphere_session', data.sessionId);
            setSessionId(data.sessionId);
        }
        setMessages([{
            id: Date.now().toString(),
            type: "bot",
            content: data.reply,
            timestamp: new Date()
        }]);
    } catch(e) {
        setMessages([{
            id: Date.now().toString(),
            type: "bot",
            content: "Error connecting to AI assistant.",
            timestamp: new Date()
        }]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let storedSession = localStorage.getItem('votersphere_session') || "";
    setSessionId(storedSession);
    sendStart(storedSession, language);
  }, []);

  const clearChat = () => {
    localStorage.removeItem('votersphere_session');
    setSessionId("");
    setMessages([]);
    sendStart("", language);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setLangOpen(false);
    // Clear session and restart in the new language
    localStorage.removeItem('votersphere_session');
    setSessionId("");
    setMessages([]);
    sendStart("", lang);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, message: text, language })
      });
      const data = await res.json();
      
      const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.reply,
          timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "Error connecting to AI assistant.",
          timestamp: new Date()
      }]);
    } finally {
        setIsLoading(false);
    }
  };

  const quickOptions = [
    "How to apply for Voter ID?",
    "Find my polling booth",
    "How to correct details?",
    "First time voter guide",
    "Address change process",
    "How do EVMs work?",
    "Vote remotely",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-white to-green-500 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  {translations[language]?.title || translations["English"].title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {translations[language]?.subtitle || translations["English"].subtitle}
                </p>
              </div>
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Language Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label="Select language"
                  className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{language}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", langOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 z-50 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="max-h-64 overflow-y-auto py-1">
                        {LANGUAGES.map(lang => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
                              lang === language
                                ? "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                          >
                            {lang}
                            {lang === language && <Check className="w-4 h-4 text-orange-500" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 sm:flex-none">
                <button
                  onClick={() => setActiveTab("chat")}
                  aria-label="Chat tab"
                  className={cn("flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium transition-colors", activeTab === "chat" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400")}
                >
                  {translations[language]?.chatTab || translations["English"].chatTab}
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  aria-label="Timeline tab"
                  className={cn("flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium transition-colors", activeTab === "timeline" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400")}
                >
                  {translations[language]?.timelineTab || translations["English"].timelineTab}
                </button>
                <button
                  onClick={() => setActiveTab("steps")}
                  aria-label="Steps tab"
                  className={cn("flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium transition-colors", activeTab === "steps" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400")}
                >
                  {translations[language]?.stepsTab || translations["English"].stepsTab}
                </button>
              </div>

              {/* Clear Chat Button */}
              {activeTab === "chat" && (
                  <button 
                    onClick={clearChat}
                    title={translations[language]?.clearChat || translations["English"].clearChat}
                    aria-label="Clear chat history"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                      <Trash2 className="w-5 h-5" />
                  </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Area */}
      {activeTab === "chat" && (
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickActionButton icon={FileText} label="Apply Voter ID" onClick={() => sendMessage("How do I apply for a Voter ID?")} />
                <QuickActionButton icon={MapPin} label="Find Booth" onClick={() => sendMessage("Help me find my polling booth")} />
                <QuickActionButton icon={CreditCard} label="Correct Details" onClick={() => sendMessage("How do I correct my voter details?")} />
                <QuickActionButton icon={AlertCircle} label="Remote Voting" onClick={() => sendMessage("Can I vote remotely?")} />
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-4 sm:p-6 mb-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                          <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                  </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-900 p-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-md flex items-center gap-2">
              <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder={translations[language]?.placeholder || translations["English"].placeholder}
                  aria-label="Type your question about Indian elections"
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-800 dark:text-gray-100"
              />
              <button 
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-full p-2.5 transition-colors"
              >
                  <Send className="w-5 h-5" />
              </button>
          </div>

          {/* Quick Options Pills */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Common Questions:</h3>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(option)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      )}

      {activeTab === "timeline" && <Timeline />}
      {activeTab === "steps" && <Steps />}

    </div>
  );
}

export default function App() {
  return <IndianVoterAssistant />;
}
