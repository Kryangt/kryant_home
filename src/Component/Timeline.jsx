import React, { useEffect, useRef, useState } from "react";
import './Timeline.css';

export function Timeline(){
    const timelineRef = useRef(null);
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // Trigger only once
          }
        },
        { threshold: 0.3 } // 30% of element visible to trigger
      );
  
      if (timelineRef.current) {
        observer.observe(timelineRef.current);
      }
  
      return () => observer.disconnect();
    }, []);
   
    return (
        <div
        className={`timeline ${visible ? "animate" : ""}`}
        ref={timelineRef}>
                <div class = "container-left">
                    <img src = "Textures/dot.jpg"></img>
                    <div class = "text-box">
                        <h2>The Beginning</h2>
                        <p><small>2004.12.07</small></p>
                        <p>I was born 🎉</p>
                        <span class = "left-arrow"></span>
                    </div>

                </div>
                

        </div>
    )
}