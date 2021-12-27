import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import useToggle from 'hooks/useToggle'
import cn from 'classnames'
import "./Home.css"
import Modal from 'react-modal'

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export default function Home() {
    const [isOpen, setIsOpen] = useState(false)
    const [isOn, toggleIsOn] = useToggle()
    const [searchParams, setSearchParams] = useSearchParams()
    const [dark, setDark] = useState(false)
    const pomodoroSeconds = 0.1 * 60;
    const shortBreakSeconds = 5 * 60;
    const longBreakSeconds = 20 * 60;
    const sessions = [
        { label: 'pomodoro', seconds: pomodoroSeconds },
        { label: 'short break', seconds: shortBreakSeconds },
        { label: 'long break', seconds: longBreakSeconds },

    ]
    const [currentSession, setCurrentSession] = useState(0)

    const [count, setCount] = useState(sessions[0].seconds)
    const [intervalId, setIntervalId] = useState(0)

    let audio = new Audio('/alarm.mp3')

    useEffect(() => {
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log(Boolean(searchParams.get('dark')))
        setDark(Boolean(searchParams.get('dark')))
    }, [searchParams])

    useEffect(() => {
        if (isOn === true) {
            const id = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
        }
    }, [isOn])


    useEffect(() => {
        if (count === 0) {
            audio.play()
            console.log("finished")
            clearInterval(intervalId)
            setCurrentSession((currentSession + 1) % sessions.length)
            toggleIsOn()
        }
    }, [count]);

    useEffect(() => {
        clearInterval(intervalId)
        if (isOn === true) {
            toggleIsOn()
        }
        setCount(sessions[currentSession].seconds)
    }, [currentSession])

    

    return (
        <div className={`h-screen w-full md:p-5`} style={{ backgroundColor: dark ? '#303437' : '#fff' }}>
            <div className="max-w-5xl mx-auto">
                <div className="md:w-4/12 mx-auto">
                    <div className="rounded-xl bg-neutral-500 p-6 flex flex-col space-y-6 h-screen md:h-min">
                        <div className="flex flex-row items-center justify-items-center justify-center space-x-2 w-full">
                            {sessions.map((session, i) => {
                                return (
                                    <button
                                        className={`rounded px-3 py-2 text-white text-xs font-medium ${currentSession === i && "bg-neutral-400"}`}
                                        onClick={() => { setCurrentSession(i) }}
                                    >
                                        {session.label}
                                    </button>

                                )
                            })}
                        </div>
                        <h1 className="text-7xl text-white font-semibold text-center">{pad((count - (count % 60)) / 60, 2)}:{pad(count % 60, 2)}</h1>
                        <button
                            className={`transition-all px-10 mx-auto max-w-max py-3 uppercase rounded-md z-1 relative inline-block start-button ${isOn ? 'bg-neutral-300 text-white active' : 'bg-white text-neutral-400'}`}
                            onClick={toggleIsOn}
                        >
                            {!isOn ? "start" : "stop"}
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(true)} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" data-modal-toggle="default-modal">
                Toggle modal
            </button>
            {isOpen &&
                <div id="default-modal" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed w-full left-0 top-0 z-50 flex justify-center items-start h-modal md:h-screen md:inset-0 bg-slate-700 bg-opacity-50">
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto mt-12">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                                    Terms of Service
                                </h3>
                                <button onClick={() => setIsOpen(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="default-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                </p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                </p>
                            </div>
                            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                <button data-modal-toggle="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button data-modal-toggle="default-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    )
}
