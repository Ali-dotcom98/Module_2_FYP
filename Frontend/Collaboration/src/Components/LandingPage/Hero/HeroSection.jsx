import React from 'react';
import { ArrowRight, Users, CheckCircle, Layers } from 'lucide-react';
import Animation from '../../Illustrators/Animation';

const Hero = () => {
  return (
    <section className="pt-5  font-urbanist overflow-y-hidden  h-[85vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 translate-y-3">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            
                <div className="space-y-1 -translate-y-16">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                            <span>Collaborate in Real-Time </span>
                            <span className="text-4xl  text-purple-500">
                                Solve Assignments Smarter
                            </span>
                        </h1>
                        

                        <p className="text-lg text-gray-600 leading-relaxed mt-4">
                            Empower your students and instructors with a <span className="font-semibold">live, collaborative environment</span>.  
                            Share ideas, vote on solutions, and refine answers together with <strong>Code Ascend</strong>.
                        </p>


                    <ul className="text-gray-700 font-semibold space-y-3  pt-3 pb-5 text-sm">
                        <li className="flex items-center gap-2">
                        <CheckCircle className="text-[#6c63ff] h-5 w-5" /> Real-time collaborative solving
                        </li>
                        <li className="flex items-center gap-2">
                        <CheckCircle className="text-[#6c63ff] h-5 w-5" /> Supports MCQs, True/False & coding tasks
                        </li>
                        <li className="flex items-center gap-2">
                        <CheckCircle className="text-[#6c63ff] h-5 w-5" /> Instant feedback & performance tracking
                        </li>
                    </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4  py-5">
                        <button className="group bg-[#6c63ff] text-white px-6 py-3 rounded-xl text-lg hover:bg-purple-600/15 hover:text-purple-600 font-semibold transition-colors">
                            <span>Start an Assignment</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 inline ml-2" />
                        </button>

                        <button className="bg-white text-gray-700 px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-purple-600/15 hover:text-purple-600 transition-all duration-200 font-semibold text-lg">
                            Explore Templates
                        </button>
                    </div>
                </div>

          
            <div className='-translate-y-16 -translate-x-2 '>
                <Animation/>
            </div>
            
            </div>
        </div>
    </section>
  );
};

export default Hero;
