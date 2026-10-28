// src/components/MohallaScene3D.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  DECOR_SPOTS,
  SHOPS_DATA,
  SANATHI_CORNERS,
  SANATHI_FINALE_POS,
} from '../data/diwaliData';

export default function MohallaScene3D({
  isBlurred,
  isLocked,
  isRunning,
  virtualKeysRef,
  completedDecorIds,
  pujaCompleted,
  dinnerCompleted,
  sanathiState,
  teleportTarget,
  crackerBurstEvent,
  onUpdatePlayerHUD,
  onPromptChange,
  onTriggerAction,
  onSanathiJumpAttempt,
}) {
  const mountRef = useRef(null);
  const [floatingLabels, setFloatingLabels] = useState([]);

  const stateRef = useRef({
    isLocked,
    isRunning,
    completedDecorIds,
    pujaCompleted,
    dinnerCompleted,
    sanathiState,
  });

  useEffect(() => {
    stateRef.current = {
      isLocked,
      isRunning,
      completedDecorIds,
      pujaCompleted,
      dinnerCompleted,
      sanathiState,
    };
  }, [isLocked, isRunning, completedDecorIds, pujaCompleted, dinnerCompleted, sanathiState]);

  const playerRef = useRef(null);
  const velocityYRef = useRef(0);
  const isGroundedRef = useRef(true);
  const currentPromptRef = useRef(null);
  const fireworksRef = useRef([]);
  const sceneObjectsRef = useRef({
    decorMeshes: {},
    markerRings: {},
    sanathiFireMesh: null,
    handTorchMesh: null,
  });

  useEffect(() => {
    if (teleportTarget && playerRef.current) {
      playerRef.current.position.set(teleportTarget[0], teleportTarget[1], teleportTarget[2]);
      velocityYRef.current = 0;
    }
  }, [teleportTarget]);

  // Realistic Pataka Animations Handler (Chakri & Rocket upgraded)
  useEffect(() => {
    if (!crackerBurstEvent || !sceneObjectsRef.current.scene || !playerRef.current) return;
    const scene = sceneObjectsRef.current.scene;
    const origin = playerRef.current.position.clone().add(new THREE.Vector3(0, 0.5, 1.4));
    const type = crackerBurstEvent.type;

    const group = new THREE.Group();
    const particles = [];

    if (type === 'bullet') {
      for (let i = 0; i < 28; i++) {
        const geo = new THREE.SphereGeometry(0.15, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(origin);
        group.add(mesh);
        particles.push({
          mesh,
          vel: new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 4, (Math.random() - 0.5) * 6),
        });
      }
    } else if (type === 'sparkler') {
      for (let i = 0; i < 45; i++) {
        const geo = new THREE.SphereGeometry(0.08, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: '#fde047' });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(origin).add(new THREE.Vector3(0, 0.8, 0));
        group.add(mesh);
        particles.push({
          mesh,
          vel: new THREE.Vector3((Math.random() - 0.5) * 3.5, Math.random() * 3.5 + 1, (Math.random() - 0.5) * 3.5),
        });
      }
    } else if (type === 'fountain') {
      for (let i = 0; i < 65; i++) {
        const geo = new THREE.SphereGeometry(0.09, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: '#fb923c' });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(origin);
        mesh.position.y = 0.1;
        group.add(mesh);
        particles.push({
          mesh,
          vel: new THREE.Vector3((Math.random() - 0.5) * 2.5, Math.random() * 9 + 5, (Math.random() - 0.5) * 2.5),
        });
      }
    } else if (type === 'spinner') {
      // 🌟 Realistic Ground Chakri: Spiraling outward sparks with circular motion & bounce
      const groundOrigin = origin.clone();
      groundOrigin.y = 0.15;
      for (let i = 0; i < 60; i++) {
        const geo = new THREE.SphereGeometry(0.08, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#4ade80' : '#fde047' });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(groundOrigin);
        group.add(mesh);
        particles.push({
          mesh,
          originPos: groundOrigin,
          angle: (i / 60) * Math.PI * 2,
          speed: 22.0,
          radius: 0.1 + (i % 3) * 0.12,
          isSpinner: true,
        });
      }
    } else if (type === 'rocket') {
      // 🌟 Realistic Sky Rocket: Acceleration, tail spark trail & massive spherical sky burst
      const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8);
      const mat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
      const rocketMesh = new THREE.Mesh(geo, mat);
      rocketMesh.position.copy(origin);
      group.add(rocketMesh);
      particles.push({
        mesh: rocketMesh,
        isRocket: true,
        vel: new THREE.Vector3((Math.random() - 0.5) * 1.2, 30, (Math.random() - 0.5) * 1.2),
      });
    }

    scene.add(group);
    fireworksRef.current.push({ group, particles, type, age: 0 });
  }, [crackerBurstEvent]);

  useEffect(() => {
    const { decorMeshes, markerRings, sanathiFireMesh, handTorchMesh } = sceneObjectsRef.current;

    DECOR_SPOTS.forEach((spot) => {
      const isDone = completedDecorIds.includes(spot.id);
      if (decorMeshes[spot.id]) decorMeshes[spot.id].visible = isDone;
      if (markerRings[spot.id]) markerRings[spot.id].visible = !isDone;
    });

    if (markerRings['puja_room']) markerRings['puja_room'].visible = !pujaCompleted;
    if (markerRings['dinner_table']) markerRings['dinner_table'].visible = !dinnerCompleted;

    SANATHI_CORNERS.forEach((corner) => {
      const showCorner =
        sanathiState.active &&
        !sanathiState.completed &&
        !sanathiState.purifiedCorners.includes(corner.id);
      if (markerRings[corner.id]) markerRings[corner.id].visible = showCorner;
    });

    if (handTorchMesh) {
      handTorchMesh.visible = sanathiState.active && !sanathiState.completed;
    }

    if (sanathiFireMesh) {
      sanathiFireMesh.visible =
        sanathiState.active &&
        !sanathiState.completed &&
        sanathiState.purifiedCorners.length >= 4;
    }
  }, [completedDecorIds, pujaCompleted, dinnerCompleted, sanathiState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070510');
    scene.fog = new THREE.FogExp2('#070510', 0.015);
    sceneObjectsRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      180
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#fde68a', 0.75));

    const dirLight = new THREE.DirectionalLight('#fbd38d', 0.85);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const warmHouseLight = new THREE.PointLight('#fb923c', 3.0, 30);
    warmHouseLight.position.set(0, 5, 3);
    scene.add(warmHouseLight);

    const starGeo = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 350; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 140,
        15 + Math.random() * 40,
        (Math.random() - 0.5) * 140
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: '#fef08a', size: 0.28 })
    );
    scene.add(stars);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ color: '#110d1f', roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const courtyard = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 8),
      new THREE.MeshStandardMaterial({ color: '#2e1a12', roughness: 0.9 })
    );
    courtyard.rotation.x = -Math.PI / 2;
    courtyard.position.set(0, 0.01, 6.2);
    scene.add(courtyard);

    const street = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 10),
      new THREE.MeshStandardMaterial({ color: '#171328', roughness: 0.95 })
    );
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0.02, 13.5);
    scene.add(street);

    // House & External Stairs
    const house = new THREE.Group();
    const creamWallMat = new THREE.MeshStandardMaterial({ color: '#fdf6e2', roughness: 0.65 });
    const maroonTrimMat = new THREE.MeshStandardMaterial({ color: '#7c2d12', roughness: 0.6 });
    const floorMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.7 });

    const gfBase = new THREE.Mesh(new THREE.BoxGeometry(11, 0.25, 7.5), floorMat);
    gfBase.position.set(0, 0.12, 0);
    house.add(gfBase);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(11, 7.8, 0.3), creamWallMat);
    backWall.position.set(0, 3.9, -3.6);
    house.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.8, 7.5), creamWallMat);
    leftWall.position.set(-5.35, 3.9, 0);
    house.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.8, 7.5), creamWallMat);
    rightWall.position.set(5.35, 3.9, 0);
    house.add(rightWall);

    const centerDivider = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 6.8), creamWallMat);
    centerDivider.position.set(0, 2.0, -0.2);
    house.add(centerDivider);

    [-5.2, 0, 5.2].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 3.8, 0.38), maroonTrimMat);
      pillar.position.set(px, 2.0, 3.6);
      house.add(pillar);
    });

    const ffSlab = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.3, 7.7), maroonTrimMat);
    ffSlab.position.set(0, 3.9, 0);
    house.add(ffSlab);

    const ffBackRoom = new THREE.Mesh(new THREE.BoxGeometry(10.6, 3.6, 4.5), creamWallMat);
    ffBackRoom.position.set(0, 5.8, -1.3);
    house.add(ffBackRoom);

    [-2.5, 2.5].forEach((wx) => {
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 1.4),
        new THREE.MeshBasicMaterial({ color: '#fef08a' })
      );
      win.position.set(wx, 5.8, 0.98);
      house.add(win);
    });

    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.3, 7.7), maroonTrimMat);
    roofSlab.position.set(0, 7.7, 0);
    house.add(roofSlab);

    const stairGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.38, 0.45),
        new THREE.MeshStandardMaterial({ color: '#b45309' })
      );
      step.position.set(6.0, i * 0.38 + 0.19, 2.2 - i * 0.42);
      stairGroup.add(step);
    }
    for (let i = 0; i < 10; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.38, 0.45),
        new THREE.MeshStandardMaterial({ color: '#92400e' })
      );
      step.position.set(-6.0, 3.9 + i * 0.38 + 0.19, -1.8 + i * 0.42);
      stairGroup.add(step);
    }
    house.add(stairGroup);

    // Puja Room
    const altarBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.9, 1.2),
      new THREE.MeshStandardMaterial({ color: '#92400e' })
    );
    altarBase.position.set(-2.7, 0.65, -2.5);
    house.add(altarBase);

    const textureLoader = new THREE.TextureLoader();
    const ganeshTex = textureLoader.load('/ganesh.png');
    const lakshmiTex = textureLoader.load('/lakshmi.png');

    const ganeshPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.0),
      new THREE.MeshBasicMaterial({ map: ganeshTex, side: THREE.DoubleSide })
    );
    ganeshPlane.position.set(-3.2, 1.55, -3.32);
    house.add(ganeshPlane);

    const lakshmiPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.0),
      new THREE.MeshBasicMaterial({ map: lakshmiTex, side: THREE.DoubleSide })
    );
    lakshmiPlane.position.set(-2.2, 1.55, -3.32);
    house.add(lakshmiPlane);

    // Dining Room
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.3, 0.1),
      new THREE.MeshStandardMaterial({ color: '#b45309' })
    );
    frameMesh.position.set(2.7, 2.5, -3.4);
    house.add(frameMesh);

    const artCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.95),
      new THREE.MeshBasicMaterial({ color: '#10b981' })
    );
    artCanvas.position.set(2.7, 2.5, -3.33);
    house.add(artCanvas);

    const diningTable = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.8, 1.6),
      new THREE.MeshStandardMaterial({ color: '#78350f' })
    );
    diningTable.position.set(2.7, 0.6, -1.8);
    house.add(diningTable);

    const familySeats = [
      { pos: [1.7, 0.85, -1.8], color: '#3b82f6' },
      { pos: [3.7, 0.85, -1.8], color: '#ec4899' },
      { pos: [2.3, 0.85, -2.6], color: '#a855f7' },
      { pos: [3.1, 0.85, -2.6], color: '#22c55e' },
    ];
    familySeats.forEach((f) => {
      const famGroup = new THREE.Group();
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.7, 0.35),
        new THREE.MeshStandardMaterial({ color: f.color })
      );
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.38, 0.38),
        new THREE.MeshStandardMaterial({ color: '#fdba74' })
      );
      head.position.y = 0.55;
      famGroup.add(torso, head);
      famGroup.position.set(f.pos[0], f.pos[1], f.pos[2]);
      house.add(famGroup);
    });

    scene.add(house);

    // Neighbor Houses
    const neighborColors = ['#27203d', '#1e293b', '#3b1c32', '#143138', '#382211'];
    [-24, -16, 16, 24].forEach((nx, idx) => {
      const nHouse = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(8, 7.5, 8),
        new THREE.MeshStandardMaterial({ color: neighborColors[idx % neighborColors.length], roughness: 0.8 })
      );
      body.position.y = 3.75;
      nHouse.add(body);

      for (let i = -3; i <= 3; i++) {
        const lightBulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#fde047' : '#f97316' })
        );
        lightBulb.position.set(i * 1.2, 7.5, 4.02);
        nHouse.add(lightBulb);
      }

      [-2, 2].forEach((wx) => {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(1.2, 1.4),
          new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? '#fef08a' : '#fb923c' })
        );
        win.position.set(wx, 4.5, 4.02);
        nHouse.add(win);
      });

      nHouse.position.set(nx, 0, -1);
      scene.add(nHouse);
    });

    const createMarkerRing = (id, pos, colorHex = '#fbbf24') => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.45, 0.65, 24),
        new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos[0], pos[1] + 0.02, pos[2]);
      scene.add(ring);
      sceneObjectsRef.current.markerRings[id] = ring;
    };

    DECOR_SPOTS.forEach((spot) => {
      createMarkerRing(spot.id, spot.pos, '#fbbf24');

      let visualMesh;
      if (spot.type === 'rangoli') {
        const rGroup = new THREE.Group();
        const outer = new THREE.Mesh(
          new THREE.CircleGeometry(1.35, 32),
          new THREE.MeshBasicMaterial({ color: '#ec4899', polygonOffset: true, polygonOffsetFactor: -2 })
        );
        const mid = new THREE.Mesh(
          new THREE.CircleGeometry(0.9, 24),
          new THREE.MeshBasicMaterial({ color: '#fbbf24', polygonOffset: true, polygonOffsetFactor: -3 })
        );
        const inner = new THREE.Mesh(
          new THREE.CircleGeometry(0.45, 16),
          new THREE.MeshBasicMaterial({ color: '#38bdf8', polygonOffset: true, polygonOffsetFactor: -4 })
        );
        outer.rotation.x = -Math.PI / 2;
        mid.rotation.x = -Math.PI / 2;
        inner.rotation.x = -Math.PI / 2;
        rGroup.add(outer, mid, inner);
        rGroup.position.set(spot.pos[0], 0.04, spot.pos[2]);
        visualMesh = rGroup;
      } else if (spot.type === 'diya') {
        const diyaGroup = new THREE.Group();
        const bowl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.16, 0.16, 14),
          new THREE.MeshStandardMaterial({ color: '#9a3412' })
        );
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.32, 10),
          new THREE.MeshBasicMaterial({ color: '#fde047' })
        );
        flame.position.y = 0.22;
        diyaGroup.add(bowl, flame);
        diyaGroup.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
        visualMesh = diyaGroup;
      } else {
        const lightsGroup = new THREE.Group();
        for (let i = -5; i <= 5; i++) {
          const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 8),
            new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#fde047' : '#f97316' })
          );
          bulb.position.set(i * 0.95, 0, 0);
          lightsGroup.add(bulb);
        }
        lightsGroup.position.set(0, 3.9, 3.75);
        visualMesh = lightsGroup;
      }

      visualMesh.visible = false;
      scene.add(visualMesh);
      sceneObjectsRef.current.decorMeshes[spot.id] = visualMesh;
    });

    createMarkerRing('puja_room', [-2.7, 0.14, -1.2], '#f59e0b');
    createMarkerRing('dinner_table', [2.7, 0.14, -0.7], '#10b981');

    SANATHI_CORNERS.forEach((c) => {
      createMarkerRing(c.id, c.pos, '#ef4444');
      sceneObjectsRef.current.markerRings[c.id].visible = false;
    });

    const sanathiFireMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.6, 1.25, 14),
      new THREE.MeshBasicMaterial({ color: '#f97316' })
    );
    sanathiFireMesh.position.set(
      SANATHI_FINALE_POS[0],
      SANATHI_FINALE_POS[1] + 0.5,
      SANATHI_FINALE_POS[2]
    );
    sanathiFireMesh.visible = false;
    scene.add(sanathiFireMesh);
    sceneObjectsRef.current.sanathiFireMesh = sanathiFireMesh;

    // Market Stalls & NPCs
    SHOPS_DATA.forEach((shop) => {
      const stallGroup = new THREE.Group();
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.1, 1.8),
        new THREE.MeshStandardMaterial({ color: shop.baseColor })
      );
      counter.position.y = 0.55;
      stallGroup.add(counter);

      [
        [-1.45, -0.75],
        [1.45, -0.75],
        [-1.45, 0.75],
        [1.45, 0.75],
      ].forEach(([px, pz]) => {
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8),
          new THREE.MeshStandardMaterial({ color: '#ca8a04' })
        );
        pole.position.set(px, 1.4, pz);
        stallGroup.add(pole);
      });

      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(2.6, 1.2, 4),
        new THREE.MeshStandardMaterial({ color: shop.roofColor })
      );
      canopy.position.y = 3.1;
      canopy.rotation.y = Math.PI / 4;
      stallGroup.add(canopy);

      const boxColors = ['#3b82f6', '#22c55e', '#eab308', '#ec4899', '#f97316'];
      boxColors.forEach((col, idx) => {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.38, 0.38),
          new THREE.MeshStandardMaterial({ color: col })
        );
        box.position.set(-1.0 + idx * 0.5, 1.28, 0.2);
        stallGroup.add(box);
      });

      const keeper = new THREE.Group();
      const kBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.95, 0.4),
        new THREE.MeshStandardMaterial({ color: shop.roofColor })
      );
      kBody.position.y = 0.65;
      const kHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: '#fdba74' })
      );
      kHead.position.y = 1.38;
      keeper.add(kBody, kHead);
      keeper.position.set(2.1, 0, -0.2);
      stallGroup.add(keeper);

      stallGroup.position.set(shop.pos[0], 0, shop.pos[2]);
      scene.add(stallGroup);

      createMarkerRing(shop.id, [shop.pos[0], 0.04, shop.pos[2] - 1.7], '#38bdf8');
    });

    const npcs = [];
    const npcConfigs = [
      { x: -6, z: 10.5, color: '#38bdf8', speed: 0.025, dir: 1 },
      { x: 4, z: 12.5, color: '#4ade80', speed: 0.03, dir: -1 },
      { x: -10, z: 14.0, color: '#f43f5e', speed: 0.02, dir: 1 },
      { x: 9, z: 11.0, color: '#a855f7', speed: 0.022, dir: -1 },
    ];
    npcConfigs.forEach((cfg) => {
      const npc = new THREE.Group();
      const nBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.9, 0.38),
        new THREE.MeshStandardMaterial({ color: cfg.color })
      );
      nBody.position.y = 0.65;
      const nHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.42, 0.42),
        new THREE.MeshStandardMaterial({ color: '#fdba74' })
      );
      nHead.position.y = 1.35;
      npc.add(nBody, nHead);
      npc.position.set(cfg.x, 0, cfg.z);
      scene.add(npc);
      npcs.push({ mesh: npc, ...cfg });
    });

    // Player
    const playerGroup = new THREE.Group();
    const leftLeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.5, 0.24),
      new THREE.MeshStandardMaterial({ color: '#f8fafc' })
    );
    leftLeg.position.set(-0.15, 0.25, 0);
    const rightLeg = leftLeg.clone();
    rightLeg.position.set(0.15, 0.25, 0);

    const kurta = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.85, 0.4),
      new THREE.MeshStandardMaterial({ color: '#dc2626' })
    );
    kurta.position.y = 0.9;

    const pHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.48, 0.48),
      new THREE.MeshStandardMaterial({ color: '#fdba74' })
    );
    pHead.position.y = 1.58;

    const hair = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.18, 0.5),
      new THREE.MeshStandardMaterial({ color: '#1e1b4b' })
    );
    hair.position.y = 1.82;

    const handTorch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.85, 8),
      new THREE.MeshBasicMaterial({ color: '#f97316' })
    );
    handTorch.position.set(0.45, 1.05, 0.3);
    handTorch.rotation.x = Math.PI / 4;
    handTorch.visible = false;
    sceneObjectsRef.current.handTorchMesh = handTorch;

    playerGroup.add(leftLeg, rightLeg, kurta, pHead, hair, handTorch);
    playerGroup.position.set(0, 0, 7.5);
    scene.add(playerGroup);
    playerRef.current = playerGroup;

    const keys = {};
    let cameraYaw = 0;
    let cameraPitch = 0.3;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const triggerJump = () => {
      if (stateRef.current.isLocked || !isGroundedRef.current) return;
      velocityYRef.current = 0.23;
      isGroundedRef.current = false;

      const sState = stateRef.current.sanathiState;
      if (sState.active && !sState.completed && sState.purifiedCorners.length >= 4) {
        const pPos = playerGroup.position;
        const distToFire = Math.hypot(
          pPos.x - SANATHI_FINALE_POS[0],
          pPos.z - SANATHI_FINALE_POS[2]
        );
        if (distToFire < 3.2) {
          if (onSanathiJumpAttempt) {
            onSanathiJumpAttempt();
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      keys[e.code] = true;
      if (stateRef.current.isLocked) return;
      if (e.code === 'KeyE' && currentPromptRef.current) {
        onTriggerAction(currentPromptRef.current);
      }
      if (e.code === 'Space') {
        triggerJump();
      }
    };

    const handleKeyUp = (e) => {
      keys[e.code] = false;
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraYaw -= dx * 0.007;
      cameraPitch = Math.max(-0.2, Math.min(1.1, cameraPitch + dy * 0.007));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animId;
    let frameCounter = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frameCounter++;

      const isLocked = stateRef.current.isLocked;
      const vKeys = virtualKeysRef?.current || {};
      if (vKeys.jump && !isLocked) {
        triggerJump();
        vKeys.jump = false;
      }

      if (!isLocked) {
        const speed = stateRef.current.isRunning ? 0.16 : 0.095;
        let moveForward = 0;
        let moveRight = 0;

        if (keys['KeyW'] || keys['ArrowUp'] || vKeys.up) moveForward += 1;
        if (keys['KeyS'] || keys['ArrowDown'] || vKeys.down) moveForward -= 1;
        if (keys['KeyD'] || keys['ArrowRight'] || vKeys.right) moveRight += 1;
        if (keys['KeyA'] || keys['ArrowLeft'] || vKeys.left) moveRight -= 1;

        if (moveForward !== 0 || moveRight !== 0) {
          const len = Math.hypot(moveForward, moveRight);
          moveForward /= len;
          moveRight /= len;

          const forwardX = Math.sin(cameraYaw);
          const forwardZ = -Math.cos(cameraYaw);
          const rightX = Math.cos(cameraYaw);
          const rightZ = Math.sin(cameraYaw);

          const dx = (forwardX * moveForward + rightX * moveRight) * speed;
          const dz = (forwardZ * moveForward + rightZ * moveRight) * speed;

          playerGroup.position.x = Math.max(-22, Math.min(22, playerGroup.position.x + dx));
          playerGroup.position.z = Math.max(-3.2, Math.min(20, playerGroup.position.z + dz));
          playerGroup.rotation.y = Math.atan2(dx, dz);
        }
      }

      let floorBaseY = 0;
      const pPos = playerGroup.position;
      if (pPos.x > 5.3 && pPos.x < 7.0 && pPos.z > -2.5 && pPos.z < 2.5) {
        floorBaseY = Math.max(0, Math.min(3.9, (2.5 - pPos.z) * 1.1));
      } else if (pPos.x < -5.3 && pPos.x > -7.0 && pPos.z > -2.5 && pPos.z < 2.5) {
        floorBaseY = Math.max(3.9, Math.min(7.85, 3.9 + (pPos.z + 2.5) * 1.0));
      } else if (pPos.y >= 7.0 || (pPos.z < -0.5 && pPos.y > 6.0)) {
        floorBaseY = 7.85;
      } else if (pPos.y >= 3.3 || (pPos.z < 3.0 && pPos.y > 2.5)) {
        floorBaseY = 4.05;
      } else {
        floorBaseY = 0;
      }

      playerGroup.position.y += velocityYRef.current;
      if (playerGroup.position.y > floorBaseY) {
        velocityYRef.current -= 0.012;
      } else {
        playerGroup.position.y = floorBaseY;
        velocityYRef.current = 0;
        isGroundedRef.current = true;
      }

      npcs.forEach((n) => {
        n.mesh.position.x += n.speed * n.dir;
        if (n.mesh.position.x > 14) n.dir = -1;
        if (n.mesh.position.x < -14) n.dir = 1;
        n.mesh.rotation.y = n.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      });

      const camDist = 6.5;
      const camY = playerGroup.position.y + 2.2 + Math.sin(cameraPitch) * camDist;
      const camX = playerGroup.position.x - Math.sin(cameraYaw) * Math.cos(cameraPitch) * camDist;
      const camZ = playerGroup.position.z + Math.cos(cameraYaw) * Math.cos(cameraPitch) * camDist;

      camera.position.set(camX, Math.max(playerGroup.position.y + 0.4, camY), camZ);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.3, playerGroup.position.z);

      // Realistic Chakri & Rocket Physics & Animation Update Loop
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.age += 0.02;

        fw.particles.forEach((p) => {
          if (p.isSpinner) {
            // Chakri physics: Spreads outward in spiral circles with bounce
            p.angle += p.speed * 0.035;
            p.radius += 0.028;
            p.mesh.position.x = p.originPos.x + Math.cos(p.angle) * p.radius;
            p.mesh.position.z = p.originPos.z + Math.sin(p.angle) * p.radius;
            p.mesh.position.y = 0.15 + Math.sin(fw.age * 18 + p.angle) * 0.08;
            p.mesh.scale.multiplyScalar(0.985);
          } else if (p.isRocket && fw.age < 1.1) {
            // Rocket shoots up fast with acceleration
            p.mesh.position.addScaledVector(p.vel, 0.04);
            p.vel.y -= 0.15;

            // Spawn realistic fiery tail sparks behind the rocket
            if (Math.random() > 0.25) {
              const tailGeo = new THREE.SphereGeometry(0.06, 4, 4);
              const tailMat = new THREE.MeshBasicMaterial({ color: '#fb923c' });
              const tailMesh = new THREE.Mesh(tailGeo, tailMat);
              tailMesh.position.copy(p.mesh.position).add(new THREE.Vector3(0, -0.4, 0));
              fw.group.add(tailMesh);
              fw.particles.push({
                mesh: tailMesh,
                vel: new THREE.Vector3((Math.random() - 0.5) * 2, -Math.random() * 2.5, (Math.random() - 0.5) * 2),
                isTailSpark: true,
              });
            }
          } else if (p.isRocket && fw.age >= 1.1 && !p.exploded) {
            // Rocket explodes into magnificent spherical fireworks in the sky
            p.exploded = true;
            p.mesh.visible = false;
            for (let k = 0; k < 75; k++) {
              const geo = new THREE.SphereGeometry(0.12, 6, 6);
              const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(Math.random(), 1.0, 0.65) });
              const star = new THREE.Mesh(geo, mat);
              star.position.copy(p.mesh.position);
              fw.group.add(star);
              
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos((Math.random() * 2) - 1);
              const speed = Math.random() * 9 + 4;
              
              fw.particles.push({
                mesh: star,
                vel: new THREE.Vector3(
                  speed * Math.sin(phi) * Math.cos(theta),
                  speed * Math.sin(phi) * Math.sin(theta),
                  speed * Math.cos(phi)
                ),
              });
            }
          } else if (p.isTailSpark) {
            p.mesh.position.addScaledVector(p.vel, 0.03);
            p.mesh.scale.multiplyScalar(0.92);
          } else {
            p.mesh.position.addScaledVector(p.vel, 0.04);
            p.vel.y -= 0.18; // Gravity effect
            p.mesh.scale.multiplyScalar(0.97);
          }
        });

        if (fw.age > 2.5) {
          scene.remove(fw.group);
          fireworksRef.current.splice(i, 1);
        }
      }

      const {
        completedDecorIds: doneDecor,
        pujaCompleted: donePuja,
        dinnerCompleted: doneDinner,
        sanathiState: sState,
      } = stateRef.current;

      let foundPrompt = null;

      if (!isLocked) {
        for (const spot of DECOR_SPOTS) {
          if (doneDecor.includes(spot.id)) continue;
          const dist = Math.hypot(pPos.x - spot.pos[0], pPos.y - spot.pos[1], pPos.z - spot.pos[2]);
          if (dist < 2.3) {
            foundPrompt = { type: 'decor', id: spot.id, label: spot.label, spot };
            break;
          }
        }

        if (!foundPrompt && sState.active && !sState.completed) {
          for (const corner of SANATHI_CORNERS) {
            if (sState.purifiedCorners.includes(corner.id)) continue;
            const dist = Math.hypot(
              pPos.x - corner.pos[0],
              pPos.y - corner.pos[1],
              pPos.z - corner.pos[2]
            );
            if (dist < 2.4) {
              foundPrompt = { type: 'sanathi_corner', id: corner.id, label: corner.label };
              break;
            }
          }
        }

        if (!foundPrompt && !donePuja) {
          const distPuja = Math.hypot(pPos.x - -2.7, pPos.y - 0, pPos.z - -1.2);
          if (distPuja < 2.4) {
            foundPrompt = {
              type: 'puja',
              id: 'puja_room',
              label: '🛕 Step 3: Lakshmi-Ganesh Puja [E]',
            };
          }
        }

        if (!foundPrompt && !doneDinner) {
          const distDinner = Math.hypot(pPos.x - 2.7, pPos.y - 0, pPos.z - -0.7);
          if (distDinner < 2.4) {
            foundPrompt = {
              type: 'dinner',
              id: 'dinner_table',
              label: '🍽️ Step 6: Family Diwali Dinner [E]',
            };
          }
        }

        if (!foundPrompt) {
          for (const shop of SHOPS_DATA) {
            const distShop = Math.hypot(pPos.x - shop.pos[0], pPos.z - (shop.pos[2] - 1.7));
            if (distShop < 2.6) {
              foundPrompt = {
                type: 'shop',
                id: shop.id,
                shop,
                label: shop.badgeLabel,
              };
              break;
            }
          }
        }
      }

      if (currentPromptRef.current?.id !== foundPrompt?.id) {
        currentPromptRef.current = foundPrompt;
        onPromptChange(foundPrompt);
      }

      if (frameCounter % 3 === 0 && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const activeBadges = [];

        const projectPoint = (id, text, worldPos, isHighlight = false) => {
          const vec = new THREE.Vector3(worldPos[0], worldPos[1] + 1.15, worldPos[2]);
          vec.project(camera);
          if (vec.z < 1.0) {
            const sx = (vec.x * 0.5 + 0.5) * width;
            const sy = (-(vec.y * 0.5) + 0.5) * height;
            if (sx > 40 && sx < width - 40 && sy > 50 && sy < height - 80) {
              activeBadges.push({ id, text, x: sx, y: sy, isHighlight });
            }
          }
        };

        DECOR_SPOTS.forEach((spot) => {
          if (!doneDecor.includes(spot.id)) {
            projectPoint(spot.id, spot.label, spot.pos, spot.type === 'rangoli');
          }
        });

        if (!donePuja) {
          projectPoint('puja_room', '🛕 Step 3: Lakshmi-Ganesh Puja [E]', [-2.7, 0.5, -1.5]);
        }
        if (!doneDinner) {
          projectPoint('dinner_table', '🍽️ Step 6: Family Diwali Dinner [E]', [2.7, 0.5, -1.2]);
        }

        SHOPS_DATA.forEach((shop) => {
          projectPoint(shop.id, shop.badgeLabel, [shop.pos[0], 1.2, shop.pos[2] - 1.0]);
        });

        SANATHI_CORNERS.forEach((c) => {
          if (sState.active && !sState.completed && !sState.purifiedCorners.includes(c.id)) {
            projectPoint(c.id, c.label, c.pos, true);
          }
        });

        setFloatingLabels(activeBadges);
      }

      let zone = 'Mohalla Entrance & Courtyard';
      if (pPos.y >= 7.3) zone = 'Rooftop (Chhat)';
      else if (pPos.y >= 3.6) zone = 'First Floor Balcony';
      else if (pPos.z < 3.5 && pPos.x < 0) zone = 'Lakshmi-Ganesh Puja Room';
      else if (pPos.z < 3.5 && pPos.x >= 0) zone = 'Family Dining Room';
      else if (pPos.z > 10.5) zone = 'Diwali Market Lane';

      onUpdatePlayerHUD({ x: pPos.x, y: pPos.y, z: pPos.z }, zone);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        ref={mountRef}
        className={`w-full h-full transition-all duration-500 ${
          isBlurred ? 'blur-md scale-105' : 'blur-0 scale-100'
        }`}
      />

      {!isBlurred && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {floatingLabels.map((lbl) => (
            <div
              key={lbl.id}
              style={{
                left: `${lbl.x}px`,
                top: `${lbl.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-lg border transition-all duration-75 ${
                lbl.isHighlight
                  ? 'bg-amber-400 text-slate-950 border-amber-200 font-black'
                  : 'bg-slate-950/90 text-amber-200 border-amber-500/60 backdrop-blur-sm'
              }`}
            >
              {lbl.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}