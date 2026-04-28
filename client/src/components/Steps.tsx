import { motion } from "framer-motion";
import { UserPlus, Search, MapPin, Hand, Award } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Check Eligibility & Register",
    description: "You must be an Indian citizen, 18+ years old. Fill Form 6 on the NVSP portal or Voter Helpline App to register.",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
  },
  {
    id: "02",
    title: "Verify Electoral Roll",
    description: "Search your name in the electoral roll using your EPIC number or basic details to confirm your registration is active.",
    icon: Search,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
  },
  {
    id: "03",
    title: "Find Your Polling Booth",
    description: "Use the ECI website, app, or SMS service to locate your exact polling station before election day.",
    icon: MapPin,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
  },
  {
    id: "04",
    title: "Cast Your Vote",
    description: "Go to your booth with your Voter ID (or approved alternate ID). Press the button against your chosen candidate on the EVM.",
    icon: Hand,
    color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
  },
  {
    id: "05",
    title: "Verify via VVPAT",
    description: "Check the VVPAT slip that appears for 7 seconds behind the glass to confirm your vote was recorded correctly.",
    icon: Award,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"
  }
];

export function Steps() {
  return (
    <div className="py-6 pb-24 max-w-2xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Voter's Journey</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step guide to exercising your democratic right.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Background Number */}
            <div className="absolute -right-4 -bottom-4 text-8xl font-black text-gray-50 dark:text-gray-800/50 opacity-50 select-none z-0">
              {step.id}
            </div>

            <div className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
              <step.icon className="w-7 h-7" />
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
