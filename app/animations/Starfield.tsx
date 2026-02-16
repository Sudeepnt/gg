'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Render full screen quad irrespective of camera
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  // Permutation polynomial: (34x^2 + x) mod 289
  vec4 permute(vec4 x) {
    return mod((34.0 * x + 1.0) * x, 289.0);
  }

  // Simplex 3D Noise 
  // by Ian McEwan, Ashima Arts
  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0.0 + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  uniform float uSeed; // Random seed for unique shapes on refresh

  void main() {
    // Scale 0.85 creates approx 3-4 distinct blobs on screen
    float scale = 0.85; 
    
    // Animate noise (Slightly slower)
    // Layer 1
    float n1 = snoise(vec3(vUv * scale + uSeed, uTime * 0.1));
    
    // Layer 2
    float n2 = snoise(vec3(vUv * scale * 2.0 + uSeed + 10.0, uTime * 0.14));
    
    // Layer 3
    float n3 = snoise(vec3(vUv * scale * 4.0 + uSeed - 10.0, uTime * 0.18));

    // Combine layers
    float combinedNoise = (n1 * 0.5) + (n2 * 0.3) + (n3 * 0.2);

    // Normalize roughly to [0, 1]
    float rawIntensity = combinedNoise * 0.5 + 0.5;

    // Dynamic Thresholding (Breathing Effect)
    // Oscillation slowed down (0.25)
    float pulse = sin(uTime * 0.25) * 0.05; 
    
    // Lowered base threshold (0.40) to GUARANTEE coverage
    // Even at max pulse, clouds will cover >20% of screen
    float low = 0.40 + pulse;
    float high = 0.75 + pulse;

    float intensity = smoothstep(low, high, rawIntensity);

    // White/Grey Cloud Color Scheme
    vec3 deepBlack = vec3(0.0);
    vec3 brightWhite = vec3(0.36); 
    
    vec3 color = mix(deepBlack, brightWhite, intensity);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function NoiseBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: Math.random() * 100.0 }, // Randomize shape on mount
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function Starfield() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* 1. Underlying Blue Shader Animation */}
      <Canvas>
        <NoiseBackground />
      </Canvas>

      {/* 2. Overlay CSS Noise Animation */}
      <div className="bg"></div>

      {/* Alignment lines */}
      <div className="fixed top-0 bottom-0 left-[12vw] w-[1px] bg-white/20 z-[5] pointer-events-none"></div>
      <div className="fixed top-0 bottom-0 right-[12vw] w-[1px] bg-white/20 z-[5] pointer-events-none"></div>

      <style jsx global>{`
        body {
          margin: 0;
          overflow-x: hidden;
          background-color: #000;
        }
      `}</style>

      <style jsx>{`
        .bg {
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200vh;
          background: transparent url('https://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
          background-repeat: repeat;
          background-size: 500px 500px; 
          animation: bg-animation .04s infinite;
          opacity: 0.9; 
          filter: brightness(5.0) invert(1);
          visibility: visible;
          pointer-events: none;
          z-index: 10;
        }

        @keyframes bg-animation {
            0% { transform: translate(0,0) }
            10% { transform: translate(-5%,-5%) }
            20% { transform: translate(-10%,5%) }
            30% { transform: translate(5%,-10%) }
            40% { transform: translate(-5%,15%) }
            50% { transform: translate(-10%,5%) }
            60% { transform: translate(15%,0) }
            70% { transform: translate(0,10%) }
            80% { transform: translate(-15%,0) }
            90% { transform: translate(10%,5%) }
            100% { transform: translate(5%,0) }
        }
      `}</style>
    </div>
  );
}
