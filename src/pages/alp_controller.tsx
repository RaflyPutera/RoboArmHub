'use client'

import { useState, useRef, useEffect } from 'react'
import { Header } from '@/components/mini'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, Camera, RotateCcw, PlayCircle, StopCircle, Plus, Minus, Pause, Play } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios'

export function LoadingScreen() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-semibold">Setting up system...</p>
    </div>
    </>
  )
}

export default function AlpController() {
  //ini load
  const [iniLoading, iniLoadingSet]=useState(true)
  const [isHMI, setIsHmi]=useState(false)

  //robot states
  const [robotModel, setRobotModel] = useState('')
  const [robotLoading, setRobotLoading] = useState(false)
  const [robotConnected, setRobotConnected] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [pause,setPause]= useState(false)

  //camera states
  const [cameraModel, setCameraModel] = useState('')
  const [cameraLoading, setCameraLoading] = useState(false)
  const [cameraConnected, setCameraConnected] = useState(false)

  //pallet
  const [activePallet, setActivePallet] = useState('A')

  //process states
  const [selectProcess, setSelectProcess] = useState('all')
  const [activeProcess, setActiveProcess] = useState<string[]>([])
  const [beginProcess, setBeginProcess] = useState(false)
  const [processLoading, setProcessLoading]= useState(false)

  //image
  const [showImage, setShowImage] = useState(false)
  const [image,setImage] = useState('')
  // const [imageStep, setImageStep] = useState(0)

  //websocket
  const [messages, setMessages] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

  const connectToWebSocket = () => {
    const ws = new WebSocket('ws://172.16.11.57:8885/mixstack/robot_output')

    ws.onopen = () => {
      console.log('Connected to WebSocket server')
      // setMessages(prev => [...prev, 'Connected to robot control server'])
    }

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data])
      const startIndex = event.data.indexOf(": ") + 2; // Find the index after the colon and space
      const filteredString = event.data.slice(startIndex);
      if(filteredString==="picking up box" || filteredString==="waiting for incoming"){
          getImage()
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setMessages(prev => [...prev, 'Error: Backend is not running'])
    }

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server')
      // setMessages(prev => [...prev, 'Disconnected from robot control server'])
    }

    wsRef.current = ws
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  //find out if device is HMI or not
  const deviceHandler=()=>{
    const HMI = window.matchMedia("(max-height: 768px) and (max-width: 1024px)").matches
    setIsHmi(HMI)
  }
  useEffect(()=>{
    deviceHandler()
    window.addEventListener("resize",deviceHandler)
    return () => window.removeEventListener("resize",deviceHandler)
  },[])

  const getImage= async () => {
    try {
      const response = await axios.get(`http://172.16.11.57:8885/mixstack/snapshots?step=500`, { 
        headers: {'Authorization': `Bearer ${token}`},
        responseType: 'blob' },
      )
      const objectUrl = URL.createObjectURL(response.data)
      setImage(objectUrl)
      setShowImage(true)
      // setImageStep(prev => prev + 1)
    } catch (err) {
      console.log("error getting image")
      setShowImage(false)
    }
  }
  const toggleRobotConnection = async () => {
    try{
      setRobotLoading(true)
      
      const response =await axios.post(`http://172.16.11.57:8885/mixstack/connect_robot?robot=${encodeURIComponent(robotModel)}&ip=192.168.1.15&port=10040`,{},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response)
      setRobotConnected(true)
      setRobotLoading(false)
    }
    catch(err){
      console.log(err)
      setRobotLoading(false)
    }
  }

  const togglePause = async () => {
    if(!pause){
      const response = await axios.post(`http://172.16.11.57:8885/mixstack/pause_robot`,{},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      console.log(response)
      if(response.status === 200){
        setPause(true)
      }
    }
    else{
      const response = await axios.post(`http://172.16.11.57:8885/mixstack/resume_robot`,{},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      console.log(response)
      if(response.status === 200){
        setPause(false)
      }
    }
  }

  const changeSpeed =(type:string) => {
    if(type ==='min'){
      if(speed!==0)
      setSpeed(speed-10)
    }
    else{
      if(speed!==100)
      setSpeed(speed+10)
    }

  }
  const sendSpeed= async ()=>{
    const response= await axios.post(`http://172.16.11.57:8885/mixstack/speed_control?speed=${speed}`,{},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    console.log(response)
  }
  useEffect(()=>{
    if (robotConnected){
      sendSpeed()
    // sendSpeed()
    }
  },[speed])

  const toggleCameraConnection = async () => {
    try{
      setCameraLoading(true)
      const response = await axios.post(`http://172.16.11.57:8885/mixstack/connect_camera?camera=${encodeURIComponent(cameraModel)}`,{},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response)

      setCameraConnected(true)
      setCameraLoading(false)
    }
    catch(err){
      console.log(err)
      setCameraLoading(false)
    }
  }

  const setPallet= async(selection:string)=>{
    const response = await axios.post(`http://172.16.11.57:8885/mixstack/set_dimensions?selection=${encodeURIComponent(selection)}`,{},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response)
    if(response.status===200){
      setActivePallet(selection)
    }
  }
  
  const startProcess = async () => {
    // setProcessRunning(true)
    try{
      console.log("process selected is",selectProcess)
      const response = await axios.post(`http://172.16.11.57:8885/mixstack/run_process?script_name=${encodeURIComponent(selectProcess)}`,{},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response)
      if(selectProcess === 'ALL'){
        setActiveProcess(['F01','F02', 'F03','F04'])
      }
      else{
        setActiveProcess(prev => {
          if(prev.includes(selectProcess)){
            console.log("Process already active:", selectProcess)
            return prev
          }
          return [...prev, selectProcess];
        })
      }
      setProcessLoading(true)
      setBeginProcess(true)
    }
    catch(err){
      console.log(err)
    }
  }
  
  const stopProcess = async () => {
    const response = await axios.post(`http://172.16.11.57:8885/mixstack/stop_process?script_name=${encodeURIComponent(selectProcess)}`,{},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response)
    setProcessLoading(true)
    if (selectProcess==="ALL"){
      setActiveProcess([])
    }
    else{
      setActiveProcess(prev => [...prev.filter(item=> item !==selectProcess)])
    }
  }

  useEffect(()=>{
    if(activeProcess.length === 0){
      setBeginProcess(false)
    }
  },[activeProcess])

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setProcessLoading(false)
    },4000)
    return () => clearTimeout(timer);
  },[processLoading])
  
  const reset = async () => {
    //robot states
    const response = await axios.post(`http://172.16.11.57:8885/mixstack/reset_system`,{},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    console.log(response)

    setRobotModel('')
    setRobotConnected(false)
    setSpeed(20)
    setCameraModel('')
    setCameraConnected(false)
    setSelectProcess('all')
    setActiveProcess([])
    setBeginProcess(false)
    setMessages([])
    setShowImage(false)
    setPause(false)
  }


  //reset on mount
  useEffect(() => {
    disconnectWebSocket()
    reset()

    const timer = setTimeout(()=>{
      iniLoadingSet(false)
      connectToWebSocket()
    },6000)
    return () => clearTimeout(timer);
  }, [])

  //scroll
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  useEffect(()=>{
    scrollAreaRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  return(
    <>
    <Header/>
    {iniLoading ? <LoadingScreen/> : <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
      {/* <Card className="w-full max-w-[1400px] mx-auto shadow-lg"> */}
      <Card className={isHMI ? "w-full h-full max-w-[1024px] max-h-[768px] overflow-hidden shadow-lg":"w-full max-w-[1400px] mx-auto shadow-lg"}>
        <CardContent className="p-6">
          {isHMI? null:<h1 className="text-3xl font-bold text-primary mb-6">Robot Arm Controller</h1>}
          <div className={isHMI? "grid grid-cols-2 gap-4 h-[calc(100%-3rem)]":"grid grid-cols-1 xl:grid-cols-3 gap-6"}>
            <div className={isHMI? "col-span-1 grid grid-rows-1 gap-4":"lg:col-span-2 grid md:grid-cols-1 gap-6"}>
              <Card className={isHMI? "p-4 space-y-6 bg-card":"md:col-span-1 p-4 space-y-6 bg-card"}>
                <h2 className="text-xl font-semibold text-card-foreground">Robot Arm</h2>
                <Select
                  value={robotModel}
                  onValueChange={(value) => {
                    setRobotModel(value)
                    setRobotConnected(false)
                  }}
                  disabled={robotConnected}
                >
                  <SelectTrigger id="robotModel">
                    <SelectValue placeholder="Select robot model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yaskawa_YRC1000">Yaskawa YRC1000</SelectItem>
                    <SelectItem value="Kuka_RA10">Kuka RA10</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={toggleRobotConnection} 
                  disabled={!robotModel || robotLoading}
                  className={`w-full ${robotConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-primary'} text-primary-foreground`}
                >
                  <Wifi className="mr-2 h-4 w-4" />
                  {robotLoading ? 'Connecting...' : robotConnected ? 'Robot connected' : 'Connect Robot'}
                </Button>
                <h2 className="text-xl font-semibold text-card-foreground">Camera</h2>
                <Select
                  value={cameraModel}
                  onValueChange={(value) => {
                    setCameraModel(value)
                    setCameraConnected(false)
                  }}
                  disabled={cameraConnected}
                >
                  <SelectTrigger id="cameraModel">
                    <SelectValue placeholder="Select camera model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zed2">Zed 2</SelectItem>
                    <SelectItem value="intel">Intel L515</SelectItem>
                    <SelectItem value="kinect">Kinect</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={toggleCameraConnection} 
                  disabled={!cameraModel || cameraLoading}
                  className={`w-full ${cameraConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-primary'} text-primary-foreground`}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {cameraLoading ? 'Connecting...' : cameraConnected ? 'Camera connected' : 'Connect Camera'}
                </Button>
              </Card>
              <Card className={isHMI? "p-4 space-y-2 bg-card ":"md:col-span-1 p-4 space-y-4 bg-card"}>
                <h2 className="text-xl font-semibold text-card-foreground">Process</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-l font-semibold text-card-foreground">Select pallet size</h3>
                    <Select
                      value={activePallet}
                      onValueChange={(value) => {
                        setPallet(value)
                      }}
                      disabled={!robotConnected}
                    >
                      <SelectTrigger id="palletSize">
                        <SelectValue/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">2420 x 2420 x 3300</SelectItem>
                        <SelectItem value="B">2640 x 2420 x 3300</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-l font-semibold text-card-foreground">Select process</h3>
                    <Select
                      value={selectProcess}
                      onValueChange={setSelectProcess}
                      disabled={!robotConnected}
                    >
                      <SelectTrigger id="process">
                        <SelectValue placeholder="Select process" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Processes</SelectItem>
                        <SelectItem value="F01">F01</SelectItem>
                        <SelectItem value="F02">F02</SelectItem>
                        <SelectItem value="F03">F03</SelectItem>
                        <SelectItem value="F04">F04</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={stopProcess} 
                    disabled={!robotConnected || processLoading}
                    className="flex-1 bg-destructive text-destructive-foreground"
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                  <Button 
                    onClick={startProcess} 
                    disabled={!robotConnected || processLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                </div>
              </Card>
            </div>
            <Card className="bg-card overflow-hidden md:col-span-1">
              <CardHeader className="p-3">
                <CardTitle className="text-xl">Output</CardTitle>
                <div className="flex justify-center items-center">
                  <AnimatePresence>
                    {beginProcess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.4 } }}
                        className="text-center font-semibold bg-green-500 text-white p-2 rounded-md"
                      >
                        {activeProcess.join(', ')}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              </CardHeader>
  
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted rounded-md p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Speed:</span>
                    <Button 
                      onClick={() => changeSpeed("min")} 
                      disabled={!robotConnected || speed <= 0} 
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 text-center font-bold">{speed}%</div>
                    <Button 
                      onClick={() => changeSpeed("add")} 
                      disabled={!robotConnected || speed >= 100} 
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={togglePause}
                    disabled={!robotConnected}
                    size="sm"
                    variant={pause ? "default" : "outline"}
                    className="w-full sm:w-24"
                  >
                    {pause ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                </div>
                <Button onClick={reset} variant="outline" className="w-full bg-secondary text-secondary-foreground">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset All
                </Button>
                <ScrollArea className="h-[138px] w-full rounded-md border">
                  <div className="p-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          ref={scrollAreaRef} 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm mb-2 p-2 bg-muted rounded"
                        >
                          {message}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
                {showImage && (
                  <div className="mt-4">
                    <img src={image} alt="Camera Output" className="w-full h-auto rounded-md" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* <div className="mt-6 flex justify-center items-center">
            <AnimatePresence>
              {beginProcess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.4 } }}
                  className="text-center font-semibold bg-green-500 text-white p-2 rounded-md"
                >
                  {activeProcess.join(', ')}
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
        </CardContent>
      </Card>
    </div>
}</>)
}