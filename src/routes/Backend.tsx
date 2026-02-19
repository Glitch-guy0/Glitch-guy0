export function BackendComponent() {
  return (
    <div className="absolute top-1/2 left-8 md:left-20 transform -translate-y-1/2 text-white max-w-lg p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-4xl font-bold mb-4 text-red-500">Backend Engineering</h2>
      <p className="text-lg leading-relaxed text-gray-200">
        I architect robust server-side solutions, focusing on scalability, performance, and security.
        Using technologies like Node.js, Python, and Go, I build APIs that power complex applications.
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-300">
        <li>Microservices Architecture</li>
        <li>Database Design (SQL/NoSQL)</li>
        <li>API Development (REST/GraphQL)</li>
      </ul>
    </div>
  );
}
