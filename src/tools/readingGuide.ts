import template from "./readingGuide.html";
import css from "./readingGuide.css";

export default function readingGuide(enable=false) {
    let guide = document.querySelector('.nextbility-rg-container');

    if(enable) {
        if(!guide) {
            guide = document.createElement("div");
            guide.classList.add('nextbility-rg-container');
            guide.innerHTML = `<style>${css}</style>${template}`;

            const rgTop: HTMLElement = guide.querySelector('.nextbility-rg-top');
            const rgBottom: HTMLElement = guide.querySelector('.nextbility-rg-bottom');
            const margin = 20;

            window.__nextbility__onScrollReadableGuide = (event) => {
                rgTop.style.height = `${event.clientY - margin}px`;
                rgBottom.style.height = `${window.innerHeight - event.clientY - (margin * 2)}px`;
            }

            document.addEventListener('mousemove', window.__nextbility__onScrollReadableGuide, { passive: false });
            
            document.body.appendChild(guide);
        }
    } else {
        guide?.remove();

        if(window.__nextbility__onScrollReadableGuide) {
            document.removeEventListener('mousemove', window.__nextbility__onScrollReadableGuide);
            delete window.__nextbility__onScrollReadableGuide;
        }
    }
}