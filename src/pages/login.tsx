import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon } from 'lucide-react'
import { RSDPLogo } from '@/components/mini'
import {useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function Component() {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)

const [loginError,setLoginError] = useState(false)
const [errorMessage,setErrorMessage] = useState('')

const navigate = useNavigate();

const isFormValid = username && password

const handleSubmit = async (e: React.FormEvent) => {
    // sessionStorage.removeItem('token')
    e.preventDefault()
    console.log('Logging in...')
    try{
            const response =await axios.post(`http://172.16.11.57:8885/login`,{
                username: username,
                password: password
            },{headers:{'Content-Type': 'application/json'}})
            sessionStorage.setItem('token', response.data.access_token);
            navigate('/home')
        }
    catch(err:any){
        console.log(err)
        const type=err.response.data.detail
        setLoginError(true)
        if(type==='Invalid username'){setErrorMessage('Account not found, try again')}
        if(type==='Invalid password'){setErrorMessage('Invalid password, try again')}
    }
}

useEffect(() => {
    console.log("User agent:",navigator.userAgent)
    console.log("Platform:",navigator.platform)
    const removePrevToken = async () => {
        const response = await axios.post(`http://172.16.11.57:8885/logout?token=${sessionStorage.getItem('token')}`)
        console.log(response)
        
    }
    removePrevToken()
    sessionStorage.removeItem('token')
    
    const updateMousePosition = (e: MouseEvent) => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    document.documentElement.style.setProperty('--mouse-x', x.toString())
    document.documentElement.style.setProperty('--mouse-y', y.toString())
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
}, [])

return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
    <style>{`
        :root {
        --mouse-x: 0.5;
        --mouse-y: 0.5;
        }
        .gradient-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(
            circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
            rgba(114, 161, 237, 0.15),
            transparent 80%
        );
        pointer-events: none;
        }
    `}</style>
    <div className="gradient-bg"></div>
    <div>
        <div className="flex items-center justify-center ">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md text-center"
            >
            <RSDPLogo className='w-50 h-50 mx-auto'/>
            {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Project Hub</h1> */}
            
            </motion.div>
        </div>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex items-center justify-center px-8 relative z-10"
        >
            <div className="w-full max-w-md">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-8 text-center text-gray-800"
            >
                Project Hub Login
                {loginError ? 
                <div className='bg-red-400 text-white text-sm rounded-lg mt-4 font-normal '>
                    {errorMessage}
                </div>
                
                :null
            }
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                <div className="relative">
                    <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" 
                    className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Label 
                    htmlFor="username" 
                    className={`absolute left-10 transition-all duration-200 ${
                        username ? '-top-6 text-xs text-blue-600' : 'top-1/2 transform -translate-y-1/2 text-transparent'
                    }`}
                    >
                    Username
                    </Label>
                </div>
                </div>
                <div className="space-y-2">
                <div className="relative">
                    <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    <Label 
                    htmlFor="password" 
                    className={`absolute left-10 transition-all duration-200 ${
                        password ? '-top-6 text-xs text-blue-600' : 'top-1/2 transform -translate-y-1/2 text-transparent'
                    }`}
                    >
                    Password
                    </Label>
                </div>
                </div>
                <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                >
                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                    disabled={!isFormValid}
                >
                    Log In
                </Button>
                </motion.div>
            </form>
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                If you're having trouble logging in, please contact your system administrator.
                </p>
            </div>
            </div>
        </motion.div>
        </div>
    </div>
)
}