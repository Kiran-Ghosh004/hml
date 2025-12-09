import { motion } from "framer-motion";

export default function DataCard({ title, value, unit }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 p-5 rounded-xl shadow-xl border border-gray-700"
    >
      <h3 className="text-lg text-gray-300">{title}</h3>
      <p className="text-3xl font-semibold text-white mt-2">
        {value} <span className="text-gray-400 text-lg">{unit}</span>
      </p>
    </motion.div>
  );
}
