import { motion } from "framer-motion";
import { Calendar, Flag, FileText, CheckCircle, Users, BarChart3, TrendingUp } from "lucide-react";

const timelineEvents = [
  {
    id: 1,
    title: "Election Announcement",
    description: "The Election Commission of India (ECI) announces the election schedule, enacting the Model Code of Conduct.",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Filing Nominations",
    description: "Candidates file their nomination papers with the Returning Officer.",
    icon: FileText,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 3,
    title: "Scrutiny & Withdrawal",
    description: "Nominations are scrutinized. Valid candidates can withdraw their names if they choose not to contest.",
    icon: CheckCircle,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    title: "Election Campaign",
    description: "Parties and candidates campaign. Campaigning ends 48 hours before polling begins.",
    icon: Flag,
    color: "from-red-500 to-red-600",
  },
  {
    id: 5,
    title: "Polling Day",
    description: "Voters cast their votes using Electronic Voting Machines (EVMs) and VVPATs.",
    icon: Users,
    color: "from-green-500 to-green-600",
  },
  {
    id: 6,
    title: "Counting of Votes",
    description: "EVMs are opened in secure counting centers under strict observation.",
    icon: BarChart3,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: 7,
    title: "Declaration of Results",
    description: "The ECI declares the official results, and the formation of the new government begins.",
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600",
  }
];

export function Timeline() {
  return (
    <div className="py-6 pb-24 max-w-2xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Indian Election Timeline</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">The standard chronological phases of a general election.</p>
      </div>

      <div className="relative border-l-2 border-orange-200 dark:border-orange-800 ml-4 md:ml-6 space-y-8">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="relative pl-8"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900`}>
              <event.icon className="w-4 h-4 text-white" />
            </div>

            {/* Content Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
