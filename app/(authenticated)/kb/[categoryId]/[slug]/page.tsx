'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { KBSidebar } from '@/components/kb/KBSidebar';
import { getCategoryById } from '@/lib/mock-data/kb-categories';
import { getArticle, getArticleTableOfContents } from '@/lib/mock-data/kb-articles';

interface PageProps {
  params: Promise<{ categoryId: string; slug: string }>;
}

function DottedDivider() {
  return (
    <div
      className="h-px my-8"
      style={{
        backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
        backgroundSize: '8px 1px',
        backgroundRepeat: 'repeat-x',
      }}
    />
  );
}

export default function KBArticlePage({ params }: PageProps) {
  const { categoryId, slug } = use(params);
  const category = getCategoryById(categoryId);
  const article = getArticle(categoryId, slug);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section-id]');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = section.getAttribute('data-section-id') || '';
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, true);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  if (!category || !article) {
    notFound();
  }

  const toc = getArticleTableOfContents(article);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex -mx-6 -mt-6">
      {/* Left Sidebar - sticky */}
      <div className="sticky top-0 h-screen">
        <KBSidebar />
      </div>

      {/* Main Content - centered */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2"
          >
            <Link
              href={`/kb/${categoryId}`}
              className="text-sm text-mint hover:text-mint-light transition-colors"
            >
              {category.name}
            </Link>
          </motion.nav>

          {/* Article Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-text-primary mb-10"
          >
            {article.title}
          </motion.h1>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {article.sections.map((section, index) => (
              <div key={section.id}>
                {section.level === 2 && index > 0 && <DottedDivider />}
                <div data-section-id={section.id}>
                  {section.level === 2 ? (
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                      {section.title}
                    </h2>
                  ) : (
                    <h3 className="text-lg font-medium text-text-primary mt-8 mb-4">
                      {section.title}
                    </h3>
                  )}
                  {section.content && (
                    <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar - Table of Contents - sticky */}
      <div className="w-64 shrink-0 p-4 pl-0 hidden lg:block sticky top-0 h-screen">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pt-4"
        >
          <div className="glass-modal-card rounded-xl p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              On this page
            </h4>
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm py-1.5 rounded-lg px-2 transition-all ${
                    item.level === 3 ? 'pl-4 text-xs' : ''
                  } ${
                    activeSection === item.id
                      ? 'text-mint bg-mint/10 font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/30 dark:hover:bg-white/5'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
