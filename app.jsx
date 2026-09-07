const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence, useScroll, useTransform } = window.Motion;

// --- Icons ---
const MusicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

// --- Components ---

const StardustBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.2,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1 - 0.1,
                alpha: Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 ? '212, 175, 55' : '255, 255, 255'
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                
                p.phase += 0.01;
                const currentAlpha = p.alpha + Math.sin(p.phase) * 0.3;
                const finalAlpha = Math.max(0, Math.min(0.8, currentAlpha));

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${finalAlpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(${p.color}, ${finalAlpha})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        window.addEventListener('resize', setCanvasSize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 mix-blend-screen" />;
};

const IntroScene = ({ onComplete }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.5 } }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen z-10 relative px-4 text-center bg-obsidian-900"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 3, ease: "easeOut" }}
                className="mb-20"
            >
                <h1 className="font-cinzel text-3xl md:text-5xl tracking-widest text-gold-100 mb-6 font-light uppercase">
                    A Curated Journey
                </h1>
                <div className="w-12 h-[1px] bg-gold-500/50 mx-auto mb-6"></div>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 3 }}
                    className="font-sans font-light tracking-[0.2em] text-gold-300 text-sm md:text-base opacity-70 uppercase"
                >
                    For someone truly extraordinary
                </motion.p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 2 }}
                onClick={onComplete}
                className="group relative px-10 py-4 overflow-hidden"
            >
                <span className="relative z-10 font-sans tracking-[0.3em] uppercase text-xs font-light text-gold-200 group-hover:text-gold-500 transition-colors duration-700">
                    Enter Experience
                </span>
                <div className="absolute inset-0 border border-gold-500/20 scale-90 group-hover:scale-100 transition-transform duration-700 ease-out"></div>
                <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
            </motion.button>
        </motion.div>
    );
};

const CountdownScene = ({ onComplete }) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 2000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => onComplete(), 1000);
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, backgroundColor: "rgba(212,175,55,0.05)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex items-center justify-center min-h-screen z-20 relative bg-obsidian-900"
        >
            <AnimatePresence>
                {count > 0 && (
                    <motion.div
                        key={count}
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute font-cinzel text-8xl md:text-[12rem] font-light text-glow-gold text-gold-100"
                    >
                        {count}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const GalleryCard = ({ memory, index, totalCards }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["0 1", "1.2 1"]
    });
    
    const isLast = index === totalCards - 1;

    // لجميع الكروت الشفافية 1، ما عدا الكارت الأخير يتلاشى في نهاية السكرول ليفسح المجال للزر
    const opacity = useTransform(
        scrollYProgress, 
        isLast ? [0, 0.4, 0.85, 1] : [0, 1], 
        isLast ? [1, 1, 0.4, 0] : [1, 1]
    );
    const y = useTransform(scrollYProgress, [0, 1], [150, 0]);

    return (
        <motion.div 
            ref={cardRef}
            style={{ opacity, y }}
            className="min-h-screen flex items-center justify-center w-full sticky top-0"
        >
            <div className="gallery-card p-4 md:p-8 rounded-sm max-w-2xl w-full mx-4 flex flex-col items-center">
                <div className="w-full aspect-[16/10] overflow-hidden mb-10 relative">
                    <img 
                        src={memory.image} 
                        alt={memory.title} 
                        className="w-full h-full object-cover bw-to-color"
                    />
                </div>
                <h3 className="font-cinzel tracking-widest text-xl md:text-2xl text-gold-200 mb-6 uppercase text-center">{memory.title}</h3>
                <p className="font-sans text-gold-100/70 text-center leading-loose font-light text-sm md:text-base max-w-lg tracking-wide">{memory.text}</p>
                <div className="w-8 h-[1px] bg-gold-500/30 mt-8"></div>
            </div>
        </motion.div>
    );
};

const MemoriesScene = ({ onComplete }) => {
    const memories = [
        {
            image: "images/WhatsApp Image 2026-09-07 at 5.31.20 AM.jpeg",
            title: " My Inspiration ❤️",
            text: "You are the inspiration behind so many things I do. You make me want to dream bigger, work harder, and believe in myself even when I doubt what I’m capable of. Your smile can change my entire day, and just knowing that you believe in me gives me a reason to keep moving forward. You inspire me not only through your words, but simply by being the person you are. When I think about the future I want, somehow, you are always a part of it."
        },
        {
            image: "images/WhatsApp Image 2026-09-07 at 5.38.50 AM.jpeg",
            title: " My Motivation 🫶🏻",
            text: "You are the motivation that keeps me going when things become difficult. Whenever I feel tired, lost, or unsure of myself, I remember what I’m working toward and the life I want to build. Your love gives me a different kind of strength — the kind that makes me want to keep trying, keep improving, and never settle for less than my dreams. I want to make you proud, share my achievements with you, and have you beside me through every step of the journey."
        },
        {
            image: "images/WhatsApp Image 2026-09-07 at 6.23.08 AM.jpeg",
            title: "My Purpose ❤️",
            text: "You are more than just the person I love; you are a part of the life I want to create. You give meaning to the little things and make me look forward to tomorrow. I want to experience life with you — the beautiful days, the difficult days, the adventures, the quiet moments, and everything in between. I want to grow with you, build something real with you, and create memories that we can look back on years from now. If life is a journey, you are the person I want beside me for all of it."
        }
    ];

    const containerRef = useRef(null);

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="relative bg-obsidian-900 pb-20"
        >
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center w-full z-10 opacity-40">
                <span className="text-gold-300 font-sans tracking-[0.4em] uppercase text-[10px]">Descend</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-gold-300 to-transparent mx-auto mt-4 animate-pulse-slow"></div>
            </div>

            {/* عرض الكروت مع تفعيل تأثير الـ stacking للجميع */}
            {memories.map((memory, index) => (
                <GalleryCard 
                    key={index} 
                    memory={memory} 
                    index={index} 
                    totalCards={memories.length}
                />
            ))}

            {/* مشهد الزر: يثبت في مكانه ويدخل بنعومة بعد اختفاء آخر كارت */}
            <div className="min-h-screen flex items-center justify-center sticky top-0 z-20 pointer-events-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-center px-4"
                >
                    <div className="w-12 h-[1px] bg-gold-500/50 mx-auto mb-10"></div>
                    <motion.button
                        onClick={onComplete}
                        className="group relative px-12 py-5 overflow-hidden"
                    >
                        <span className="relative z-10 font-cinzel tracking-[0.3em] uppercase text-sm font-light text-gold-200 group-hover:text-gold-500 transition-colors duration-700">
                            Reveal the Future
                        </span>
                        <div className="absolute inset-0 border border-gold-500/30 scale-90 group-hover:scale-100 transition-transform duration-700 ease-out"></div>
                        <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const QuizScene = ({ onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [wrongIndex, setWrongIndex] = useState(null);
    const [correctIndex, setCorrectIndex] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const questions = [
        {
            q: "What is something that always makes me smile?",
            options: [" You", "Food", " Money 😂", " Funny videos"],
            answer: 0
        },
        {
            q: "What is my favorite thing to do when I’m having a bad day?",
            options: ["Sleep", "Talk to you ❤️", " Watch something"],
            answer: 1
        },
        {
            q: "What is my absolute favorite thing about you?",
            options: ["Your smile", "Your laugh", "Your heart", "All of the above"],
            answer: 3
        }
    ];

    const handleAnswer = (index) => {
        if (isTransitioning) return;

        if (index === questions[currentQuestion].answer) {
            setCorrectIndex(index);
            setIsTransitioning(true);
            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setCorrectIndex(null);
                    setIsTransitioning(false);
                } else {
                    onComplete();
                }
            }, 1500);
        } else {
            setWrongIndex(index);
            setTimeout(() => setWrongIndex(null), 500);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex flex-col items-center justify-center relative bg-obsidian-900 px-4"
        >
            <div className="z-10 text-center max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="glass-elegant p-8 md:p-12 rounded-sm"
                    >
                        <h2 className="font-cinzel text-2xl md:text-3xl text-gold-200 mb-2 uppercase tracking-widest">
                            Question {currentQuestion + 1}
                        </h2>
                        <div className="w-12 h-[1px] bg-gold-500/30 mx-auto mb-8"></div>
                        
                        <p className="font-sans text-lg md:text-xl text-white font-light mb-10 tracking-wide">
                            {questions[currentQuestion].q}
                        </p>

                        <div className="flex flex-col gap-4">
                            {questions[currentQuestion].options.map((option, index) => {
                                const isWrong = wrongIndex === index;
                                const isCorrect = correctIndex === index;
                                
                                return (
                                    <motion.button
                                        key={index}
                                        animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        onClick={() => handleAnswer(index)}
                                        className={`p-4 border transition-all duration-300 rounded-sm font-sans tracking-[0.1em] uppercase text-xs md:text-sm
                                            ${isCorrect ? 'bg-gold-500/20 border-gold-400 text-gold-100 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 
                                              isWrong ? 'bg-red-500/10 border-red-500/50 text-red-200' : 
                                              'border-gold-500/20 text-gold-100/70 hover:bg-gold-500/5 hover:border-gold-500/40 hover:text-gold-200'}`}
                                    >
                                        {option}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const FinalScene = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4 }}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-obsidian-900"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="z-10 text-center px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, duration: 4, ease: "easeOut" }}
                >
                    <h1 className="font-cinzel text-4xl md:text-7xl text-gold-100 font-light tracking-widest leading-relaxed mb-12 text-glow-gold-strong uppercase">
                        Happy Birthday
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 5, duration: 3 }}
                >
                    <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mb-12"></div>
                    <p className="font-sans text-sm md:text-lg text-gold-200/80 tracking-[0.2em] font-light uppercase leading-loose">
                        To the one who elevates every moment into a work of art.<br/><br/>
                        Here is to another year of brilliance.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

const App = () => {
    const [scene, setScene] = useState(0); 
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSceneAdvance = (nextScene) => {
        if (scene === 0 && !isPlaying && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
        }
        setScene(nextScene);
    };

    return (
        <div className="bg-obsidian-900 min-h-screen text-white font-sans hide-scrollbar">
            <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_82c2b3636f.mp3?filename=cinematic-ambient-124434.mp3"></audio>

            <button 
                onClick={toggleMusic}
                className="fixed top-8 right-8 z-50 text-gold-500/50 hover:text-gold-300 transition-colors duration-500"
            >
                <MusicIcon />
            </button>

            <StardustBackground />

            <AnimatePresence mode="wait">
                {scene === 0 && <IntroScene key="intro" onComplete={() => handleSceneAdvance(1)} />}
                {scene === 1 && <CountdownScene key="countdown" onComplete={() => handleSceneAdvance(2)} />}
                {scene === 2 && <MemoriesScene key="memories" onComplete={() => handleSceneAdvance(3)} />}
                {scene === 3 && <QuizScene key="quiz" onComplete={() => handleSceneAdvance(4)} />}
                {scene === 4 && <FinalScene key="final" />}
            </AnimatePresence>
        </div>
    );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
