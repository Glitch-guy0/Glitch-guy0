export function EmbeddedComponent() {
  return (
    <div className="absolute top-1/2 left-8 md:left-20 transform -translate-y-1/2 text-white max-w-lg p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-4xl font-bold mb-4 text-green-500">Embedded Systems</h2>
      <p className="text-lg leading-relaxed text-gray-200">
        I bridge the gap between software and hardware, developing efficient firmware for microcontrollers.
        I optimize for performance, memory constraints, and real-time processing.
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-300">
        <li>C/C++ & Rust</li>
        <li>RTOS & Bare Metal</li>
        <li>IoT Connectivity (MQTT/CoAP)</li>
      </ul>
    </div>
  );
}
