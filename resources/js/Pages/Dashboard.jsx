import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatBox from "@/Components/ChatBox";
import ThemeToggle from "../Components/ThemeToggle";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth, messages }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
                        Messages
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            Server: Reverb Active
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Chat App" />

            {/* Added dark:bg-slate-900 to the background wrapper */}
            <div className="py-6 h-[calc(100vh-120px)] dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    {/* Added dark:bg-slate-800 and dark:border-slate-700 to container */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex h-full">
                        {/* LEFT SIDE: Updated colors for Dark Mode */}
                        <aside className="w-80 border-r border-gray-100 dark:border-slate-700 hidden md:flex flex-col bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-white rounded-xl text-xs focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto px-3 py-2">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 mb-2">
                                    Channels
                                </p>

                                {/* Active Channel */}
                                <button className="w-full flex items-center gap-3 px-3 py-3 bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl mb-2">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                        #
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            General Chat
                                        </p>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                            Live Now
                                        </p>
                                    </div>
                                </button>

                                {/*  Somis-tore Team (Locked) */}
                                <button className="w-full flex items-center gap-3 px-3 py-3 opacity-60 bg-transparent border border-transparent rounded-xl cursor-not-allowed">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                                        #
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                            Somistore Team
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                Locked
                                            </span>
                                            {/* Visual cue for the recruiter */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            {/* Profile Footer */}
                            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-indigo-600 text-white flex items-center justify-center text-xs">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                            Online
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT SIDE */}
                        <main className="flex-1 flex flex-col bg-white dark:bg-slate-800">
                            <div className="h-full flex flex-col">
                                <ChatBox initialMessages={messages} />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
