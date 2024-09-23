import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dices, Blend, Table2} from "lucide-react"
import { Header } from '@/components/mini'

export default function RobotArmHub() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const programs = [
    { selection: 0, name: "RA", description: "Mixstacking for exhibition", icon: Blend, color: "blue" },
    { selection: 1, name: "ALP", description: "Seperate mixstacking (WIP)", icon: Dices, color: "blue" },
    { selection: 2, name: "Manual", description: "Read a csv file and stack", icon: Table2, color: "blue" },
  ]
  const directTo=(selection:number) => {
    //get if session is desktop or web
    // const isElectron=sessionStorage.getItem('isElectron')
    const isHMI = window.matchMedia("(max-height: 768px) and (max-width: 1024px)").matches
    const web=["RA","alp_controller"]
    const desktop=["RA_HMI","alp_controller/hmi"]

    return(
      <>{isHMI ? window.location.href=desktop[selection]:window.location.href=web[selection]}</>
      // <>{isElectron ? window.location.href=web[selection]:window.location.href=desktop[selection]}</>
    )
    // if (isElectron){
      
    // }
    // if(selection==1) window.location.href = "/alp_contoller"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header/>
      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Robot Arm Control Hub
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8 text-center text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Select a program to launch and control your robot arm:
          </motion.p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
                <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                <Card 
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border-blue-100 hover:border-blue-300"
                    onMouseEnter={() => setHoveredProgram(program.name)}
                    onMouseLeave={() => setHoveredProgram(null)}
                    onClick={()=>directTo(program.selection)}
                    
                >
                    <CardHeader className="text-center">
                    <CardTitle className="flex flex-col items-center text-2xl font-semibold">
                        <program.icon className={`h-12 w-12 mb-2 text-${program.color}-600`} />
                        {program.name}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-gray-600 text-center">{program.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                    </CardFooter>
                </Card>
                </motion.div>
            ))}
            </div>
        </div>
      </main>
      <footer className="py-6 px-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
          © 2024 RSDP RobotArmHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
