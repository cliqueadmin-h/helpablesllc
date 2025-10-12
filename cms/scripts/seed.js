/**
 * Seed script for Strapi CMS
 * Run with: npm run seed
 */

const demoData = {
  services: [
    {
      title: 'AI Integration',
      description: 'Harness the power of artificial intelligence to automate processes, gain insights, and improve decision-making across your organization.',
      icon: '🤖',
      order: 1,
    },
    {
      title: 'Custom Development',
      description: 'Build tailored software solutions using modern frameworks and best practices to meet your unique business requirements.',
      icon: '⚡',
      order: 2,
    },
    {
      title: 'Process Automation',
      description: 'Streamline repetitive tasks and workflows with intelligent automation that saves time and reduces errors.',
      icon: '🔄',
      order: 3,
    },
    {
      title: 'Cloud Solutions',
      description: 'Deploy scalable and secure cloud infrastructure on Azure, AWS, or Google Cloud to support your growing business.',
      icon: '☁️',
      order: 4,
    },
    {
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics and visualization tools.',
      icon: '📊',
      order: 5,
    },
    {
      title: 'Security & Compliance',
      description: 'Protect your digital assets with enterprise-grade security measures and compliance frameworks.',
      icon: '🔒',
      order: 6,
    },
  ],
  testimonials: [
    {
      author: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      quote: 'Helpables transformed our business operations with their AI solutions. The automation they implemented saved us countless hours and significantly reduced errors.',
      rating: 5,
      order: 1,
    },
    {
      author: 'Michael Chen',
      company: 'Innovate Solutions',
      quote: 'The custom development work was outstanding. The team understood our needs perfectly and delivered a solution that exceeded our expectations.',
      rating: 5,
      order: 2,
    },
    {
      author: 'Emily Rodriguez',
      company: 'GrowthCo',
      quote: 'Their cloud migration expertise helped us scale our infrastructure seamlessly. Highly recommend their services!',
      rating: 5,
      order: 3,
    },
  ],
  blogs: [
    {
      title: 'The Future of AI in Business Automation',
      slug: 'future-of-ai-in-business-automation',
      excerpt: 'Explore how artificial intelligence is revolutionizing business processes and what it means for your organization.',
      body: '# The Future of AI in Business Automation\n\nArtificial Intelligence is no longer a futuristic concept—it\'s here, and it\'s transforming how businesses operate. In this article, we\'ll explore the current state of AI in business automation and what the future holds.\n\n## Current Applications\n\n- **Process Automation**: AI-powered tools are handling repetitive tasks\n- **Decision Support**: Machine learning models provide data-driven insights\n- **Customer Service**: Chatbots and virtual assistants improve customer experience\n\n## Future Trends\n\nAs AI technology advances, we can expect:\n\n1. More sophisticated natural language processing\n2. Better integration with existing business systems\n3. Enhanced predictive analytics capabilities\n\n## Getting Started\n\nThe key to successful AI implementation is starting small and scaling gradually. Focus on high-impact, low-complexity use cases first.',
    },
    {
      title: 'Building Scalable Applications with Modern Frameworks',
      slug: 'building-scalable-applications-modern-frameworks',
      excerpt: 'Learn best practices for creating applications that can grow with your business using Next.js, React, and modern cloud platforms.',
      body: '# Building Scalable Applications with Modern Frameworks\n\nScalability isn\'t just about handling more users—it\'s about building systems that can evolve with your business needs.\n\n## Key Principles\n\n- **Modular Architecture**: Break your application into independent, reusable components\n- **API-First Design**: Separate frontend and backend for flexibility\n- **Cloud-Native**: Leverage cloud services for automatic scaling\n\n## Technology Stack\n\nOur recommended stack for scalable applications:\n\n- **Frontend**: Next.js with TypeScript\n- **Backend**: Node.js with Express or Serverless Functions\n- **Database**: PostgreSQL or MongoDB\n- **Hosting**: Vercel, Azure, or AWS\n\n## Best Practices\n\n1. Implement proper caching strategies\n2. Use CDNs for static assets\n3. Monitor performance metrics\n4. Plan for failure with proper error handling',
    },
    {
      title: 'Cloud Migration Strategies for Small Businesses',
      slug: 'cloud-migration-strategies-small-businesses',
      excerpt: 'A practical guide to moving your infrastructure to the cloud without breaking the bank or disrupting operations.',
      body: '# Cloud Migration Strategies for Small Businesses\n\nMoving to the cloud can seem daunting, but with the right strategy, it can be a smooth and cost-effective transition.\n\n## Why Migrate?\n\n- **Cost Savings**: Pay only for what you use\n- **Scalability**: Grow resources as needed\n- **Reliability**: Enterprise-grade infrastructure\n- **Security**: Advanced security features\n\n## Migration Approaches\n\n### Lift and Shift\nMove existing applications with minimal changes. Quick but may not leverage cloud benefits fully.\n\n### Refactor\nModify applications to take advantage of cloud-native features. More effort but better long-term results.\n\n### Hybrid Approach\nKeep some systems on-premises while moving others to the cloud.\n\n## Steps to Success\n\n1. **Assess**: Inventory your current infrastructure\n2. **Plan**: Choose the right cloud provider and migration strategy\n3. **Pilot**: Start with non-critical applications\n4. **Execute**: Migrate in phases\n5. **Optimize**: Continuously improve and optimize costs',
    },
  ],
  faqs: [
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. A simple website might take 4-6 weeks, while a custom application could take 3-6 months. We\'ll provide a detailed timeline during the initial consultation.',
      category: 'General',
      order: 1,
    },
    {
      question: 'Do you offer ongoing support?',
      answer: 'Yes! We offer maintenance and support packages to ensure your solution continues to perform optimally. This includes bug fixes, updates, and technical support.',
      category: 'Support',
      order: 2,
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'We specialize in modern web technologies including Next.js, React, Node.js, TypeScript, and cloud platforms like Azure and AWS. We also have expertise in AI/ML integration and automation tools.',
      category: 'Technical',
      order: 3,
    },
    {
      question: 'How do you ensure project success?',
      answer: 'We follow agile methodologies with regular check-ins, transparent communication, and iterative development. You\'ll be involved throughout the process and can provide feedback at each stage.',
      category: 'Process',
      order: 4,
    },
  ],
  homepage: {
    heroTitle: 'Empowering Your Digital Transformation',
    heroSubtitle: 'Innovative solutions for modern businesses. From AI integration to custom automation, we help you succeed in the digital age.',
  },
};

console.log('Seed Data for Strapi CMS');
console.log('========================\n');
console.log('To populate your Strapi CMS with demo data:');
console.log('1. Start your Strapi server: npm run develop');
console.log('2. Create an admin user if you haven\'t already');
console.log('3. Navigate to Content Manager in the admin panel');
console.log('4. Manually create entries using the data below, or use the Strapi API\n');

console.log('SERVICES:');
console.log(JSON.stringify(demoData.services, null, 2));
console.log('\n');

console.log('TESTIMONIALS:');
console.log(JSON.stringify(demoData.testimonials, null, 2));
console.log('\n');

console.log('BLOGS:');
console.log(JSON.stringify(demoData.blogs, null, 2));
console.log('\n');

console.log('FAQS:');
console.log(JSON.stringify(demoData.faqs, null, 2));
console.log('\n');

console.log('HOMEPAGE:');
console.log(JSON.stringify(demoData.homepage, null, 2));
console.log('\n');

console.log('Alternatively, use the Strapi REST API to create entries programmatically.');
console.log('See: https://docs.strapi.io/dev-docs/api/rest');
