import React from "react";
import "./text.scss";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cube from "../Cube.jsx";

function Test() {
  return (
    <div className="test">
      <Canvas camera={{ fov: 25, position: [8, 8, 8] }}>
        <OrbitControls enableZoom={false} autoRotate />
        <ambientLight intensity={1} />
        <directionalLight position={[3, 2, 1]} />
        <Cube />
      </Canvas>
    </div>
  );
}

export default Test;
