import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export function RSDPLogo(props: React.SVGProps<SVGSVGElement>) {
    const navigate=useNavigate()
    
    return (
      <>
        <motion.button 
        className="bg-transparent border-blue-100 hover:border-blue-300 hover:bg-transparent hover:scale-110"
        onClick={()=>{navigate('/home')}}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }} 
        >
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="40"
          viewBox="0 0 120 40"
          fill="none"
        >
          <path
            d="M10 30V10H20C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30H10Z"
            fill="#2563EB"
          />
          <path
            d="M40 30V10H50C55.5228 10 60 14.4772 60 20C60 25.5228 55.5228 30 50 30H40Z"
            fill="#3B82F6"
          />
          <path
            d="M70 10H90V20H70V10Z"
            fill="#60A5FA"
          />
          <path
            d="M70 20H90V30H80L70 20Z"
            fill="#93C5FD"
          />
          <path
            d="M100 10H120V30H100V10Z"
            fill="#BFDBFE"
          />
        </svg>
        </motion.button>
      </>
    )
  }
  
export function Header(){
  return(
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-center">
        <RSDPLogo className="h-8 w-auto"></RSDPLogo>
        <span className="sr-only">RSDP RobotArmHub</span>
      </div>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="/">
          Logout
        </a>
      </nav>
    </header>
  )
}