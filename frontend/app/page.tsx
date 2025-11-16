import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Helpables - Empowering Your Digital Transformation',
  description: 'Powering modern businesses with AI, automation, and innovation that drive digital success.',
};

export default function LandingPage() {
  const services = [
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Crafting intuitive and beautiful user experiences.',
    },
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Building fast, scalable, and secure web applications.',
    },
    {
      icon: '📱',
      title: 'Digital Marketing',
      description: 'Driving growth and engagement through strategy.',
    },
    {
      icon: '🤖',
      title: 'AI Integration',
      description: 'Leveraging artificial intelligence for smarter solutions.',
    },
    {
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Scalable and secure cloud infrastructure management.',
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Turning data into actionable business insights.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] via-[#3D2B79] to-[#1E3A8A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              src="/helpables_logo.png" 
              alt="Helpables Logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <span className="font-heading font-bold text-xl text-white">
              Agency
            </span>
          </div>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Empowering Your Digital Transformation
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Powering modern businesses with AI, automation, and innovation that drive digital success.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#00D9A3] hover:bg-[#00C492] text-[#2D1B69] font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book free consultation
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We offer a wide range of services to help you achieve your digital goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-heading font-semibold text-xl text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
