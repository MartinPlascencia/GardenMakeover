import gsap from "gsap";
import { Container, Sprite, Graphics } from "pixi.js";

export default class BasicAnimations {

    public animateButton(buttonContainer: Container | Sprite, callback?: () => void, reactivateButton: boolean = false): void {
        buttonContainer.eventMode = 'none';
        gsap.to(buttonContainer.scale, { 
            x: buttonContainer.scale.x * 0.7, 
            y: buttonContainer.scale.y * 0.7, 
            duration: 0.15 , 
            yoyo: true, 
            repeat: 1,
            ease: 'linear',
            onComplete: () => {
                gsap.to(buttonContainer.scale, { 
                    x: buttonContainer.scale.x * 0.9, 
                    y: buttonContainer.scale.y * 0.9, 
                    duration: 0.075, 
                    yoyo: true, 
                    repeat: 1,
                    ease: 'linear',
                    onComplete: () => {
                        if (reactivateButton) {
                            buttonContainer.eventMode = 'static';
                        }
                        if(callback !== undefined){
                            callback();
                        }
                    }
                });
            }
        });
    }

    public popObject(object: Container | Sprite): void {
        object.scale.x == 0 && object.scale.set(1);
        gsap.from(object.scale, { 
            x: 0, 
            y: 0, 
            duration: 0.4, 
            ease: 'back.out',
        });
    }

    public unpopObject(object: Container | Sprite): void {
        gsap.to(object.scale, {
            x: 0, 
            y: 0, 
            duration: 0.4, 
            ease: 'back.in',
        });
    }

    public fadeOut(object: Container | Sprite | Graphics, duration: number = 0.4): void {
        gsap.to(object, { 
            alpha: 0, 
            duration: duration, 
            ease: 'linear',
        });
    }

    public fadeIn(object: Container | Sprite | Graphics, duration: number = 0.4): void {
        gsap.to(object, { 
            alpha: 1, 
            duration: duration, 
            ease: 'linear',
        });
    }

    public wiggleObject(object: Container | Sprite, duration: number = 0.4): void {
        gsap.to(object.scale, { 
            x: object.scale.x * 1.1,
            y: object.scale.y * 1.1, 
            duration: duration, 
            ease: 'linear',
            yoyo: true, 
            repeat: 1,
        });
    }

    public comeFromTop(object: Container | Sprite, duration: number = 0.4): void {
        gsap.from(object, {
            y: -object.height, 
            duration: duration, 
            ease: 'back.out',
        });
    }

    public hideToTop(object: Container | Sprite, duration: number = 0.4): void {
        gsap.to(object, {
            y: -object.height, 
            duration: duration, 
            ease: 'back.in',
        });
    }

    public shakeContainer(target: Container, intensity = 10, duration = 0.5): void {
        const original = { x: target.x, y: target.y };
        const timeline = gsap.timeline({
            onComplete: () => {
                target.x = original.x;
                target.y = original.y;
            }
        });
    
        const shakes = Math.floor(duration / 0.05);
        for (let i = 0; i < shakes; i++) {
            timeline.to(target, {
                x: original.x + (Math.random() - 0.5) * intensity,
                y: original.y + (Math.random() - 0.5) * intensity,
                duration: 0.025,
                ease: "power2.out"
            });
        }
    }
}