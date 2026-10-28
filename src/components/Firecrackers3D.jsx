// src/components/Firecrackers3D.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function createFirecrackerParticleEffect(scene, type, originPos) {
  const group = new THREE.Group();
  group.position.copy(originPos);
  scene.add(group);

  const particles = [];
  let age = 0;

  if (type === 'bullet') {
    // Sutli / Atom Bomb: Big Flash & Smoke Burst on Ground
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.2;
    group.add(mesh);
    particles.push({ mesh, vel: new THREE.Vector3(0, 0, 0), life: 0.5 });
  } 
  else if (type === 'sparkler') {
    // Phuljhari: Sparkling golden showers around player hand
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.SphereGeometry(0.08, 6, 6);
      const mat = new THREE.MeshBasicMaterial({ color: '#fde047' });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 1.2, 0.5);
      group.add(mesh);
      particles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 3 + 1, (Math.random() - 0.5) * 4),
        life: 0.8,
      });
    }
  } 
  else if (type === 'fountain') {
    // Anar (Fountain): Shoots upwards from ground like a fountain
    for (let i = 0; i < 60; i++) {
      const geo = new THREE.SphereGeometry(0.09, 6, 6);
      const mat = new THREE.MeshBasicMaterial({ color: '#fb923c' });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0.1, 0);
      group.add(mesh);
      particles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 7 + 3, (Math.random() - 0.5) * 3),
        life: 1.2,
      });
    }
  } 
  else if (type === 'spinner') {
    // Zameen Chakri: Spins round and round on the ground
    for (let i = 0; i < 35; i++) {
      const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const mat = new THREE.MeshBasicMaterial({ color: '#4ade80' });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0.2, 0);
      group.add(mesh);
      particles.push({
        mesh,
        angle: (i / 35) * Math.PI * 2,
        speed: 8.0,
        radius: 0.1,
        life: 1.5,
      });
    }
  } 
  else if (type === 'rocket') {
    // Sky Rocket: Shoots high into sky and bursts into colorful stars
    const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const mat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const rocketMesh = new THREE.Mesh(geo, mat);
    rocketMesh.position.y = 0.2;
    group.add(rocketMesh);
    particles.push({ mesh: rocketMesh, isRocket: true, vel: new THREE.Vector3(0, 18, 0), life: 2.2 });
  }

  return { group, particles, type, age };
}