import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useToggle from 'hooks/useToggle'
import cn from 'classnames'
import "./Home.css"

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export default function Home() {
    const [isOn, toggleIsOn] = useToggle()
    const [searchParams, setSearchParams] = useSearchParams()
    const [dark, setDark] = useState(false)
    const pomodoroSeconds = 25 * 60;
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
                            className={`transition-all px-10 mx-auto max-w-max py-3 uppercase rounded-md z-30 relative inline-block start-button ${isOn ? 'bg-neutral-300 text-white active' : 'bg-white text-neutral-400'}`}
                            onClick={toggleIsOn}
                        >
                            {!isOn ? "start" : "stop"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
