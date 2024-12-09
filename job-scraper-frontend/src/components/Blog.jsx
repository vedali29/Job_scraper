import { useState } from 'react';

function Blog() {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Remote Work Best Practices',
      category: 'remote',
      content: 'Tips for successful remote work...'
    },
    {
      id: 2,
      title: 'Tech Interview Preparation',
      category: 'tech',
      content: 'How to prepare for technical interviews...'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Career Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map(article => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{article.title}</h2>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
              {article.category}
            </span>
            <p className="text-gray-600">{article.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;
