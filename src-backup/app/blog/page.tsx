import Blog from '@/components/Blog';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-16">
        <span className="text-amber-500">Our Blog</span>
      </h1>
      <Blog />
    </div>
  );
} 