import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Player } from "../scripts/player";
import tweenModule, { Easing } from "three/examples/jsm/libs/tween.module.js";
import StopSign from "../scripts/stopSign";

export function cubicBezier(p0: number, p1: number, p2: number, p3: number) {
    return (t: number) => {
        const t1 = 1 - t;
        return t1 * t1 * t1 * p0 + 3 * t1 * t1 * t * p1 + 3 * t1 * t * t * p2 + t * t * t * p3;
    };
}

export function Vector3ToVec3(v: THREE.Vector3): CANNON.Vec3 {
    return new CANNON.Vec3(v.x, v.y, v.z);
}
export function Vec3ToVector3(v: CANNON.Vec3): THREE.Vector3 {
    return new THREE.Vector3(v.x, v.y, v.z);
}
export function QuaternionToQuat(v: THREE.Quaternion): CANNON.Quaternion {
    return new CANNON.Quaternion(v.x, v.y, v.z, v.w);
}
export function QuatToQuaternion(v: CANNON.Quaternion): THREE.Quaternion {
    return new THREE.Quaternion(v.x, v.y, v.z, v.w);
}
export function RotToQuat(e: THREE.Euler) {
    const quaternion = new CANNON.Quaternion();
    quaternion.setFromEuler(e.x, e.y, e.z);
    return quaternion;
}

export function calculateRotationMatrix(roll: number, pitch: number, yaw: number): number[][] {
    const cosR = Math.cos(roll);
    const sinR = Math.sin(roll);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);

    const rotationMatrix: number[][] = [
        [cosY * cosP, cosY * sinP * sinR - sinY * cosR, cosY * sinP * cosR + sinY * sinR],
        [sinY * cosP, sinY * sinP * sinR + cosY * cosR, sinY * sinP * cosR - cosY * sinR],
        [-sinP, cosP * sinR, cosP * cosR],
    ];

    return rotationMatrix;
}

export const Random = {
    // Generate a random number between min (inclusive) and max (exclusive)
    int: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    float: (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    },
    possibilities: function (outcomes: Record<number, number>): number {
        // Extract the values and probabilities from the object
        const values = Object.keys(outcomes).map((v) => parseInt(v));
        const probabilities = Object.values(outcomes);

        // Calculate the sum of probabilities
        const totalProbability = probabilities.reduce((acc, prob) => acc + prob, 0);

        // Generate a random number between 0 and the total probability
        const randomValue = Math.random() * totalProbability;

        // Find the outcome based on the random value and probabilities
        let cumulativeProbability = 0;
        for (let i = 0; i < values.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomValue < cumulativeProbability) {
                return values[i];
            }
        }

        // This should not happen, but return the last value just in case
        return values[values.length - 1];
    },
};

export const TWWEENS = {
    deltaTime: (deltaTime: number) => {
        return {
            playerScale: (p: Player, scale: THREE.Vector3 | number, duration:number = 400) => {
                const startScale = p.mesh.scale.clone();
                const endScale = typeof scale === 'number' ? new THREE.Vector3(scale,scale,scale) : scale;

                let interval: number;
                const tween2 = new tweenModule.Tween(startScale)
                    .to(endScale, duration)
                    .easing(Easing.Back.InOut)
                    .onUpdate((x) => {
                        p.mesh.scale.copy(x);
                    })
                    .onComplete(() => {
                        clearInterval(interval);
                    })
                    .start(0);
                let t = 0;
                interval = setInterval(() => {
                    tween2.update(t);
                    t += deltaTime * 1000;
                }, deltaTime * 1000);
            },
            stopSign:(ss:StopSign,fun:()=>void)=>{
                const startScale = ss.mesh.scale.clone();
                const endScale = new THREE.Vector3(0,0,0);

                let interval: number;
                const tween2 = new tweenModule.Tween(startScale)
                    .to(endScale, 500)
                    .easing(Easing.Back.In)
                    .onUpdate((x) => {
                        ss.mesh.scale.copy(x);
                    })
                    .onComplete(() => {
                        clearInterval(interval);
                        fun();
                    })
                    .start(0);
                let t = 0;
                interval = setInterval(() => {
                    tween2.update(t);
                    t += deltaTime * 1000;
                }, deltaTime * 1000);
            }
        };
    },
};
