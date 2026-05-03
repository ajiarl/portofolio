import React, { useState, useEffect, useCallback, memo } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { GlobeDemo } from "../components/ui/GlobeDemo"

const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22d3ee] to-[#34d399] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#22d3ee] to-[#34d399] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-emerald-200 bg-clip-text text-transparent">
          Web
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#22d3ee] to-[#34d399] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#22d3ee] to-[#34d399] bg-clip-text text-transparent">
          Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="w-full sm:w-auto">
    <div className="group relative w-full sm:w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0891b2] to-[#059669] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#0891b2]/20 to-[#059669]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </div>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button className="group relative p-3"
      aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee] to-[#34d399] rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Mahasiswa UIN Raden Fatah", "Web Developer", "Tech Enthusiast"];
const TECH_STACK = ["React", "Tailwind CSS", "Vite", "Supabase"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/ajiarl", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ajiarlando/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/ajiii.ar/", label: "Instagram Profile" }
];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showGlobe, setShowGlobe] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowGlobe(true);
    } else {
      const timer = setTimeout(() => setShowGlobe(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <>
      <Helmet>
        <title>Aji Arlando — Fullstack Web Developer</title>
        <meta name="description" content="Website resmi Aji Arlando, Fullstack Web Developer. Saya berfokus pada penciptaan pengalaman digital yang menarik dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan." />
     <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ajiarlando.com" />
        <meta property="og:title" content="Aji Arlando — Fullstack Web Developer" />
     <meta property="og:description" content="Website resmi dan portofolio Aji Arlando, Fullstack Web Developer." />
        <meta property="og:url" content="https://ajiarlando.com" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Aji Arlando",
            "jobTitle": "Fullstack Developer",
            "url": "https://ajiarlando.com",
            "sameAs": [
              "https://github.com/ajiarl",
              "https://www.linkedin.com/in/ajiarlando/",
              "https://www.instagram.com/ajiii.ar/"
            ]
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto h-screen">
            <div className="flex flex-col lg:flex-row items-center justify-center h-full pt-20 sm:pt-16 md:justify-between gap-6 sm:gap-12 lg:gap-20">
              
              {/* Left Column */}
              <div className="w-full lg:w-1/2 order-1 lg:order-1"
                data-aos="fade-right"
                data-aos-delay="200">
                
                {/* Glassmorphism Code Editor Card */}
                <div className="relative rounded-2xl bg-[#030014]/50 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/10 to-[#34d399]/10 opacity-50"></div>
                  
                  {/* Mac OS Window Controls */}
                  <div className="flex gap-2 mb-4 relative z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-5 relative z-10">
                    <StatusBadge />
                    <MainTitle />

                    {/* Typing Effect */}
                    <div className="h-8 flex items-center font-mono" data-aos="fade-up" data-aos-delay="800">
                      <span className="text-xl md:text-2xl text-gray-300">
                        <span className="text-pink-500">const</span> <span className="text-blue-400">role</span> = <span className="text-emerald-300">"{text}"</span>;
                      </span>
                      <span className="w-[3px] h-6 bg-emerald-400 ml-1 animate-blink"></span>
                    </div>

                    {/* Description */}
                    <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                      data-aos="fade-up"
                      data-aos-delay="1000">
                      Membangun dan mengembangkan website interaktif yang fungsional dan memberikan solusi digital yang optimal.
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                      {TECH_STACK.map((tech, index) => (
                        <TechStack key={index} tech={tech} />
                      ))}
                    </div>

                    {/* CTA Buttons & Social Links */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full justify-start pt-4" data-aos="fade-up" data-aos-delay="1400">
                      <div className="flex flex-row w-full sm:w-auto gap-3">
                        <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                        <CTAButton href="#Contact" text="Contact" icon={Mail} />
                      </div>
                      
                      {/* Social Links Dipindahkan ke dalam jendela */}
                      <div className="flex gap-4">
                        {SOCIAL_LINKS.map((social, index) => (
                          <SocialLink key={index} {...social} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - WebM Video */}
              <div className="w-full py-0 sm:py-0 lg:w-1/2 h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[600px] relative flex items-center justify-center order-2 lg:order-2 mt-4 lg:mt-0 overflow-visible"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                <div className="relative w-full h-full pointer-events-auto flex items-center justify-center">
                  {showGlobe && <GlobeDemo />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);