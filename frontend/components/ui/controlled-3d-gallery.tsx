'use client';

import type React from 'react';
import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface ControlledGalleryProps {
  images: ImageItem[];
  progress: number; // 0-100
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  originalZ: number;
  imageIndex: number;
  x: number;
  y: number;
}

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        
        // Flag waving effect when hovered
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          float flagWave = waveAmplitude * dampening;
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          pos.z -= (flagWave + secondaryWave);
        }
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function ImagePlane({
  texture,
  position,
  scale,
  material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useEffect(() => {
    if (material && material.uniforms) {
      material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    }
  }, [material, isHovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  progress,
}: {
  images: ImageItem[];
  progress: number;
}) {
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === 'string' ? { src: img, alt: '' } : img
      ),
    [images]
  );

  const textures = useTexture(normalizedImages.map((img) => img.src));
  const materials = useMemo(() => 
    Array.from({ length: images.length }, () => createClothMaterial()),
    [images.length]
  );

  const depthRange = 30;
  const spacing = depthRange / Math.max(images.length - 1, 1);

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: images.length }, (_, i) => ({
      index: i,
      originalZ: i * spacing - depthRange / 2,
      imageIndex: i,
      x: (Math.sin(i * 2.5) * 3),
      y: (Math.cos(i * 1.8) * 2),
    }))
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update materials
    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
      }
    });
    
    planesData.current.forEach((plane, i) => {
      const material = materials[i];
      if (!material || !material.uniforms) return;

      // Calculate position based on progress
      // Progress 0-100 maps to moving through all images
      const progressPosition = (progress / 100) * depthRange - depthRange / 2;
      const relativeZ = plane.originalZ - progressPosition;
      
      // Normalize position within depth range
      const normalizedZ = ((relativeZ + depthRange / 2) / depthRange);
      
      // Calculate opacity based on position
      let opacity = 0;
      if (normalizedZ >= 0.05 && normalizedZ <= 0.25) {
        // Fade in
        opacity = (normalizedZ - 0.05) / 0.2;
      } else if (normalizedZ > 0.25 && normalizedZ < 0.75) {
        // Fully visible
        opacity = 1;
      } else if (normalizedZ >= 0.75 && normalizedZ <= 0.95) {
        // Fade out
        opacity = 1 - ((normalizedZ - 0.75) / 0.2);
      }
      
      opacity = Math.max(0, Math.min(1, opacity));
      
      // Calculate blur
      let blur = 0;
      if (normalizedZ < 0.1) {
        blur = 8.0 * (1 - normalizedZ / 0.1);
      } else if (normalizedZ > 0.85) {
        blur = 8.0 * ((normalizedZ - 0.85) / 0.15);
      }
      
      blur = Math.max(0, Math.min(8.0, blur));
      
      material.uniforms.opacity.value = opacity;
      material.uniforms.blurAmount.value = blur;
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];

        if (!texture || !material) return null;

        // Calculate current Z position based on progress
        const progressPosition = (progress / 100) * depthRange - depthRange / 2;
        const relativeZ = plane.originalZ - progressPosition;

        const aspect = texture.image
          ? (texture.image as any).width / (texture.image as any).height
          : 1;
        const scale: [number, number, number] =
          aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, relativeZ]}
            scale={scale}
            material={material}
          />
        );
      })}
    </>
  );
}

export default function ControlledGallery({
  images,
  progress,
  className = 'h-96 w-full',
  style,
}: ControlledGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
          <p className="text-gray-600">WebGL not supported. Showing fallback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GalleryScene images={images} progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
