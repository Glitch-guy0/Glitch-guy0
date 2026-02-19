export function DevOpsComponent() {
  return (
    <div className="absolute top-1/2 left-8 md:left-20 transform -translate-y-1/2 text-white max-w-lg p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-4xl font-bold mb-4 text-purple-500">DevOps & Cloud</h2>
      <p className="text-lg leading-relaxed text-gray-200">
        I automate infrastructure and deployment pipelines to ensure rapid and reliable software delivery.
        I leverage cloud platforms and containerization for scalable and resilient systems.
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-300">
        <li>AWS/GCP/Azure</li>
        <li>Docker & Kubernetes</li>
        <li>CI/CD (GitHub Actions/GitLab)</li>
      </ul>
    </div>
  );
}
