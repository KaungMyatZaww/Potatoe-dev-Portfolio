import "./hero.scss";
import Navbar from "../navBar/Navbar";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";
function Hero() {
  return (
    <div className="hero">
      <Navbar />

      <div className="container">
        <div className="left">
          <h1>Think. Plan. Create.</h1>
          <div className="whatWeDo">
            <img src="/images/line.png" alt="" />
            <h2>What I do.</h2>
          </div>
          <p>I like coding. And creating for LIVES easier.</p>
          <button>
            <a href="#about">More</a>
          </button>
        </div>
        <div className="right">
          <Canvas>
            {/* <Suspense fallback={null}> */}
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={1} />
            <directionalLight position={[3, 2, 1]} />
            <Sphere args={[1, 100, 200]} scale={2.4}>
              <MeshDistortMaterial
                color="#681ebd"
                attach="material"
                distort={0.5}
                speed={1}
              />
            </Sphere>
            {/* </Suspense> */}
          </Canvas>
          <img src="./images/potatoe.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
