export function FrontendComponent() {
  return (
    <div className="absolute top-1/2 left-8 md:left-20 transform -translate-y-1/2 text-white max-w-lg p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-4xl font-bold mb-4 text-blue-500">Frontend Development</h2>
      <p className="text-lg leading-relaxed text-gray-200">
        I create responsive and interactive user interfaces using modern web technologies.
        From pixel-perfect designs to complex state management, I ensure a seamless user experience.
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-300">
        <li>React & Next.js</li>
        <li>TypeScript & Tailwind CSS</li>
        <li>Interactive 3D Graphics (R3F)</li>
      </ul>
    </div>
  );
}
