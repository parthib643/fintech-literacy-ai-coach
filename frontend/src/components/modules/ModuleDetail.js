import React from 'react';
import { useParams } from 'react-router-dom';

const dummyModules = [
  { id: "1", name: "Finance Basics" },
  { id: "2", name: "Budgeting" },
  { id: "3", name: "Investment Strategies" },
  { id: "4", name: "Debt Management" }
];

const dummyLessons = [
  { id: 1, title: "What is Finance?", description: "Understand the basics of finance." },
  { id: 2, title: "Budgeting", description: "Learn to manage your money smartly." },
  { id: 3, title: "Saving vs Investing", description: "Compare saving and investing strategies." },
  { id: 4, title: "Types of Debt", description: "Good debt vs bad debt explained." }
];

const ModuleDetail = () => {
  const { id } = useParams();

  // Find the module by id, fallback to id if not found
  const module = dummyModules.find(mod => mod.id === id);
  const moduleName = module ? module.name : `Module ${id}`;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{moduleName} - Lessons</h2>
      <div className="grid gap-4">
        {dummyLessons.map(lesson => (
          <div key={lesson.id} className="border p-4 rounded shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{lesson.title}</h3>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleDetail;
