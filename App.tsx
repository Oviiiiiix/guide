import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { GUIDE_DATA } from './constants';
import { Section } from './types';
import { SearchIcon, ArrowUpIcon, ArrowDownIcon } from './components/Icons';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Engine } from '@tsparticles/engine';
import { motion } from 'framer-motion';

// Helper component defined outside the main component
const SectionCard: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <motion.div
      id={section.id}
      className="scroll-mt-24 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/10 glow-on-hover"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <details>
        <summary className="p-6 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-700/50 rounded-full">
              <section.icon className="w-6 h-6 text-sky-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">{section.title}</h2>
          </div>
          <ArrowDownIcon className="w-6 h-6 text-slate-400 transition-transform duration-300 arrow-down" />
        </summary>
        <div className="px-6 pb-6 pt-2 border-t border-slate-700">
          <div className="prose prose-invert text-slate-300 max-w-none">
            {section.content}
          </div>
        </div>
      </details>
    </motion.div>
  );
};

// Helper component defined outside the main component
const Sidebar: React.FC<{ sections: Section[], onLinkClick: (id: string) => void }> = ({ sections, onLinkClick }) => {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
      <nav>
        <ul className="space-y-2">
          {sections.map(section => (
            <li key={section.id}>
              <a 
                href={`#${section.id}`} 
                onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(section.id);
                }}
                className="flex items-center gap-3 px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-sky-300 transition-colors duration-200"
              >
                <section.icon className="w-5 h-5" />
                <span>{section.title.split('(')[0]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Helper component defined outside the main component
const BackToTopButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 left-8 p-3 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-all duration-300 z-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      aria-label="العودة إلى الأعلى"
    >
      <ArrowUpIcon className="w-6 h-6" />
    </button>
  );
};


const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return GUIDE_DATA;
    return GUIDE_DATA.filter(section =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.keywords.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSidebarLinkClick = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          const detailsElement = element.querySelector('details');
          if (detailsElement && !detailsElement.open) {
              detailsElement.open = true;
          }
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };


  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />
      <div className="min-h-screen animated-gradient relative z-10">
      <motion.header
        className="sticky top-0 z-40 w-full bg-slate-900/70 backdrop-blur-lg border-b border-slate-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-24 gap-4">
            <div className="text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-500">
                دليل التدبير الإداري للموارد البشرية
              </h1>
              <p className="text-sm text-slate-400 mt-1">وزارة الصحة والحماية الاجتماعية</p>
            </div>
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <input
                type="text"
                placeholder="ابحث في الدليل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar sections={GUIDE_DATA} onLinkClick={handleSidebarLinkClick} />
          
          <div className="flex-1 min-w-0">
            {filteredData.length > 0 ? (
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {filteredData.map(section => (
                  <SectionCard key={section.id} section={section} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-slate-400">لا توجد نتائج مطابقة لبحثك.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BackToTopButton isVisible={showBackToTop} />
      </div>
    </>
  );
};

export default App;
