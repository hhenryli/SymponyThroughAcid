import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame} from '@react-three/fiber'
import { Environment, Float, OrbitControls, ContactShadows } from '@react-three/drei'
import { LayerMaterial, Depth, Noise } from 'lamina'

import './App.css'


export default function App() {
  const [paused, setPaused] = useState(false)
  const [colorA, setColorA] = useState('#220055')
  const [colorB, setColorB] = useState('#112233')

  const randomColor = () => {
    if (paused) return
    const colorA = new THREE.Color().setHSL(
      Math.random(),
      0.4 + Math.random() * 0.6, 
      0.1 + Math.random() * 0.3
    )
    const colorB = new THREE.Color().setHSL(
      Math.random(),
      0.4 + Math.random() * 0.6, 
      0.1 + Math.random() * 0.3
    )
    setColorA(`#${colorA.getHexString()}`)
    setColorB(`#${colorB.getHexString()}`)
  }

  return (
    <>
      <div className='h-screen w-screen'>
        <Canvas onPointerUp={randomColor} shadows dpr={[1, 2]} camera={{ position: [0, 0, 5] }}>
          <OrbitControls autoRotate={!paused} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5}/>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 5]} />
          <pointLight position={[-10, -10, -5]} />

          <group position={[0, -2, 0]}>
            <Float position={[0, 2.15, 0]} speed={2} rotationIntensity={1} floatIntensity={2}>
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[1.5, 10, 10]} />
                <meshStandardMaterial color="white" roughness={0.2} metalness={0.9}/>
              </mesh>
            </Float>
            <ContactShadows scale={5} blur={3} opacity={0.15} far={4} />
          </group>

          <Environment background resolution={64}>
            <Striplight position={[10, 2, 0]} scale={[1, 4, 10]} />
            <Striplight position={[-10, 2, 0]} scale={[2, 4, 10]} />
            <mesh scale={100}>
              <sphereGeometry args={[1, 32, 32]} />
              <LayerMaterial side={THREE.BackSide}  color="#bbbbbb">
                  <Depth
                    colorA={colorA} 
                    colorB={colorB} 
                    alpha={1} 
                    mode="multiply" 
                    near={0} 
                    far={300} 
                    origin={[100, 100, 100]}
                  /> 
                <Noise mapping="local" type="cell" scale={0.8} mode="softlight" />
              </LayerMaterial>
            </mesh>
          </Environment>
        </Canvas>

        <button onClick={() => setPaused(p => !p)} className='cursor-pointer absolute text-3xl px-10 py-5 bg-white bottom-5 left-5'>
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </>
  )
}

function Pause() {

}

function Striplight(props) {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicMaterial color="#FFFFC5" />
    </mesh>
  )
}
