import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

const TerminalAbout = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'system', text: 'Welcome to AjiOS v1.0.0' },
    { type: 'system', text: 'Ketik "help" untuk melihat perintah yang tersedia.' },
    { type: 'prompt', command: undefined }
  ]);
  const containerRef = useRef(null);

  const commands = {
    help: (
      <div className="text-gray-300">
        <p>Available commands:</p>
        <ul className="list-none pl-4 space-y-1">
          <li><span className="text-emerald-400">about</span>    - Siapa Aji?</li>
          <li><span className="text-emerald-400">skills</span>   - Daftar skill teknis</li>
          <li><span className="text-emerald-400">clear</span>    - Bersihkan terminal</li>
        </ul>
      </div>
    ),
    about: (
      <div className="text-gray-300">
        <p>Hi, I'm Aji Arlando, seorang Web Developer dan mahasiswa di UIN Raden Fatah.</p>
        <p>Saya sangat antusias dengan pengembangan teknologi modern dan suka bereksperimen dengan kode.</p>
      </div>
    ),
    skills: (
      <div className="text-gray-300">
        <p>🔹 Frontend: React, TailwindCSS, Framer Motion</p>
        <p>🔹 Backend: Node.js, Express</p>
        <p>🔹 Tools: Git, VSCode, NPM</p>
      </div>
    )
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let newOutput = [...output];
      
      // Update the last prompt with the executed command
      const lastIndex = newOutput.length - 1;
      if (newOutput[lastIndex].type === 'prompt') {
        newOutput[lastIndex] = { type: 'prompt', command: input };
      }
      
      if (cmd === 'clear') {
        newOutput = [{ type: 'prompt', command: undefined }];
      } else if (commands[cmd]) {
        newOutput.push({ type: 'output', content: commands[cmd] });
        newOutput.push({ type: 'prompt', command: undefined });
      } else if (cmd !== '') {
        newOutput.push({ type: 'system', text: `Command not found: ${cmd}. Ketik "help" untuk bantuan.` });
        newOutput.push({ type: 'prompt', command: undefined });
      } else {
         newOutput.push({ type: 'prompt', command: undefined });
      }
      
      setOutput(newOutput);
      setInput('');
    }
  };

  return (
    <div className="w-full mx-auto rounded-xl overflow-hidden bg-[#0d1117] border border-gray-700/50 shadow-2xl font-mono text-sm sm:text-base mt-10 relative group transition-all duration-300 hover:shadow-emerald-500/10" data-aos="fade-up" data-aos-duration="1000">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22d3ee] to-[#34d399] rounded-xl opacity-20 blur-md group-hover:opacity-40 transition-all duration-700"></div>
      
      <div className="relative bg-[#0d1117] rounded-xl z-10 h-full">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-gray-700/50 rounded-t-xl">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
          </div>
          <div className="mx-auto text-gray-400 text-xs flex items-center gap-2">
            <Terminal size={14} />
            <span>guest@aji-arlando:~</span>
          </div>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={containerRef}
          className="p-4 h-64 sm:h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {output.map((line, index) => (
            <div key={index} className="mb-2">
              {line.type === 'system' && (
                <div className="text-gray-400">{line.text}</div>
              )}
              {line.type === 'output' && (
                <div className="text-gray-300">{line.content}</div>
              )}
              {line.type === 'prompt' && line.command !== undefined && (
                <div className="flex items-center text-emerald-400">
                  <ChevronRight size={16} className="text-emerald-500 mr-1" />
                  <span className="text-blue-400 mr-2">~</span>
                  <span className="text-gray-200">{line.command}</span>
                </div>
              )}
            </div>
          ))}
          
          {/* Active Input Line */}
          <div className="flex items-center text-emerald-400 mt-2">
            <ChevronRight size={16} className="text-emerald-500 mr-1" />
            <span className="text-blue-400 mr-2">~</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent border-none outline-none text-gray-200 ml-1"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalAbout;
