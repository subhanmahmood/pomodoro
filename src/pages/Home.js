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
    const pomodoroSeconds = 25 * 60;
    const shortBreakSeconds = 5 * 60;
    const longBreakSeconds = 20 * 60;
    const sessions = [
        { label: 'pomodoro', seconds: pomodoroSeconds, color: 'red' },
        { label: 'short break', seconds: shortBreakSeconds, color: 'blue' },
        { label: 'long break', seconds: longBreakSeconds, color: 'teal' },

    ]
    const [currentSession, setCurrentSession] = useState(0)
    const [intermediateSesssion, setIntermediateSesssion] = useState(0)
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

    const setSession = (i) => {
        setIntermediateSesssion(i)
        if (count !== sessions[currentSession].seconds) {
            setIsOpen(true)
        } else {
            setCurrentSession(i)
        }
    }


    const currentColor = sessions[currentSession].color
    return (
        <div className={`h-screen w-full md:p-5`} style={{ backgroundColor: dark ? '#303437' : '#fff' }}>
            <div className="max-w-5xl mx-auto">
                <div className="md:w-4/12 mx-auto">
                    <div className={`rounded-xl bg-${currentColor}-500 transition-all p-6 flex flex-col space-y-6 h-screen md:h-min`}>
                        <div className="flex flex-row items-center justify-items-center justify-center space-x-2 w-full">
                            {sessions.map((session, i) => {
                                return (
                                    <button
                                        className={`rounded px-3 py-2 text-white text-xs font-medium transition-all ${currentSession === i && `bg-${currentColor}-400`}`}
                                        onClick={() => { setSession(i) }}
                                    >
                                        {session.label}
                                    </button>

                                )
                            })}
                        </div>
                        <h1 className="text-7xl text-white font-semibold text-center">{pad((count - (count % 60)) / 60, 2)}:{pad(count % 60, 2)}</h1>
                        <button
                            className={`transition-all px-10 mx-auto max-w-max py-3 uppercase rounded-md z-1 relative inline-block start-button ${isOn ? `bg-${currentColor}-300 text-white active` : `bg-white text-${currentColor}-400`}`}
                            onClick={toggleIsOn}
                        >
                            {!isOn ? "start" : "stop"}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen &&
                <div id="default-modal" aria-hidden="true" className={`overflow-y-auto overflow-x-hidden fixed w-full left-0 top-0 z-50 flex justify-center items-start h-screen md:inset-0 bg-neutral-700 bg-opacity-50`}>
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto mt-12">
                        <div className={`relative bg-white rounded-lg shadow dark:bg-neutral-700 transition-all`}>
                            <div className={`flex justify-between items-start p-5 rounded-t border-b dark:border-neutral-600 transition-all`}>
                                <h3 className={`text-xl font-semibold text-neutral-900 transition-all lg:text-2xl dark:text-white`}>
                                    Confirmation
                                </h3>
                                <button onClick={() => setIsOpen(false)} type="button" className={`text-neutral-400 transition-all bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-neutral-600 dark:hover:text-white`} data-modal-toggle="default-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className={`p-6 space-y-6 dark:text-neutral-200 transition-all`}>
                                You have a timer running, are you sure you want to switch?
                            </div>
                            <div className={`flex items-center p-6 space-x-2 rounded-b border-t border-neutral-200 transition-all dark:border-neutral-600`}>
                                <button onClick={() => {
                                    setCurrentSession(intermediateSesssion)
                                    setIsOpen(false)}} type="button" className={`text-neutral-800 transition-all bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-neutral-200 dark:hover:bg-neutral-300`}>Yes</button>
                                <button onClick={() => setIsOpen(false)} type="button" className={`text-neutral-500 transition-all bg-white hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-300 rounded-lg border border-neutral-200 text-sm font-medium px-5 py-2.5 hover:text-neutral-900 focus:z-10 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-500 dark:hover:text-white dark:hover:bg-neutral-600`}>No</button>
                            </div>
                        </div>
                    </div>
                </div>}

            <div className="hidden">
                <div className="bg-red-100"></div>
                <div className="bg-red-200"></div>
                <div className="bg-red-300"></div>
                <div className="bg-red-400"></div>
                <div className="bg-red-500"></div>
                <div className="bg-red-600"></div>
                <div className="bg-red-700"></div>
                <div className="bg-red-800"></div>
                <div className="bg-red-900"></div>
                <div className="bg-blue-100"></div>
                <div className="bg-blue-200"></div>
                <div className="bg-blue-300"></div>
                <div className="bg-blue-400"></div>
                <div className="bg-blue-500"></div>
                <div className="bg-blue-600"></div>
                <div className="bg-blue-700"></div>
                <div className="bg-blue-800"></div>
                <div className="bg-blue-900"></div>
                <div className="bg-teal-100"></div>
                <div className="bg-teal-200"></div>
                <div className="bg-teal-300"></div>
                <div className="bg-teal-400"></div>
                <div className="bg-teal-500"></div>
                <div className="bg-teal-600"></div>
                <div className="bg-teal-700"></div>
                <div className="bg-teal-800"></div>
                <div className="bg-teal-900"></div>
            </div>
        </div>
    )
}
